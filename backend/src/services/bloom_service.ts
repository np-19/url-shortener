import { createHash } from "crypto";
import { UrlModel } from "../models/url_model.js";
import { ExpressError } from "../utils/expressError.js";
import { bloomEstimatedUrls, bloomBits, bloomHashFunctions } from "../config/constants.js";

// Bloom filter tuned for ~1,000,000 items and ~1% false-positive rate
const DEFAULT_N = bloomEstimatedUrls;
const BLOOM_M = bloomBits; // bits
const BLOOM_K = bloomHashFunctions;

const BYTE_SIZE = Math.ceil(BLOOM_M / 8);

let bitArray = Buffer.alloc(BYTE_SIZE, 0);
let loaded = false;
let isHealthy = false; // Track if bloom filter is operational

const setBloomBits = (shortId: string, target: Buffer = bitArray): void => {
  const positions = getHashes(shortId);

  for (const pos of positions) {
    const byteIndex = (pos / 8) | 0; //same as Math.floor(pos / 8) but faster
    const bitIndex = pos % 8;
    target[byteIndex] = target[byteIndex] | (1 << bitIndex);
  }
};

const loadFromDatabase = async (): Promise<void> => {
  try {
    const rebuilt = Buffer.alloc(BYTE_SIZE, 0);

    //load url objects as stream to avoid memory issues with large datasets. We only need shortId for bloom filter, so we project that field and exclude _id to reduce data size.
    //lean() to get plain JS objects instead of Mongoose documents, which is more efficient for this read-only operation. Cursor allows us to iterate through results one at a time without loading everything into memory.
    const cursor = UrlModel.find({}, { shortId: 1, _id: 0 }).lean().cursor();

    for await (const doc of cursor) {
      if (doc?.shortId) {
        setBloomBits(doc.shortId, rebuilt);
      }
    }

    bitArray = rebuilt;
    isHealthy = true;
    console.log("✓ Bloom filter loaded successfully");
  } catch (err: any) {
    isHealthy = false;
    console.warn("✗ Failed to load bloom filter from database:", err?.message || err);
    throw new ExpressError("Bloom filter load failed", 500);
  }
};

const ensureLoaded = async (): Promise<void> => {
  if (loaded) {
    return;
  }

  await loadFromDatabase();

  loaded = true;
};

export const rebuildBloomFromDatabase = async (): Promise<void> => {
  loaded = false;
  try {
    await loadFromDatabase();
  } catch (err: any) {
    isHealthy = false;
    console.warn("Failed to rebuild bloom filter:", err?.message || err);
  }
};

const getHashes = (value: string): number[] => {
  const hashes: number[] = [];

  for (let i = 0; i < BLOOM_K; i++) {
    const hash = createHash("sha256")
      .update(value + i)
      .digest();
    
    const num = hash.readUInt32BE(0);
    hashes.push(num % BLOOM_M);
  }

  return hashes;
};

const getBit = (pos: number): number => {
  const byteIndex = (pos / 8) | 0;
  const bitIndex = pos % 8;
  return (bitArray[byteIndex] >> bitIndex) & 1; // Extract the specific bit
};

export const addToBloom = async (shortId: string): Promise<void> => {
  try {
    await ensureLoaded();
    setBloomBits(shortId);
  } catch (err: any) {
    console.warn(`Bloom add failed for ${shortId}:`, err?.message || err);
  }
};

export const mightExistInBloom = async (shortId: string): Promise<boolean> => {
  try {
    await ensureLoaded();
    
    // If bloom filter failed to load, skip the check and assume might exist
    // This forces a database lookup instead of returning false positives
    if (!isHealthy) {
      return true;
    }
    
    const positions = getHashes(shortId);
    for (const pos of positions) {
      if (getBit(pos) === 0) return false;
    }
    return true;
  } catch (err: any) {
    console.warn(`Bloom check failed for ${shortId}, defaulting to might-exist:`, err?.message || err);
    return true;
  }
};

export const bloomInfo = (): { m: number; k: number; nEstimate: number } => ({
  m: BLOOM_M,
  k: BLOOM_K,
  nEstimate: DEFAULT_N,
});
