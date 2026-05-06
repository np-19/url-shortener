import {
  snowflakeCustomEpoch,
  snowflakeMachineId,
  snowflakeMachineIdBits,
  snowflakeSequenceBits,
} from "../config/constants.js";

const CUSTOM_EPOCH = BigInt(snowflakeCustomEpoch);
const MACHINE_ID_BITS = BigInt(snowflakeMachineIdBits);
const SEQUENCE_BITS = BigInt(snowflakeSequenceBits);

const MAX_MACHINE_ID = (1n << MACHINE_ID_BITS) - 1n;
const MAX_SEQUENCE = (1n << SEQUENCE_BITS) - 1n;

const MACHINE_SHIFT = SEQUENCE_BITS;
const TIMESTAMP_SHIFT = MACHINE_ID_BITS + SEQUENCE_BITS;

function validateSnowflakeConfig() {
  if (snowflakeMachineId < 0 || snowflakeMachineId > Number(MAX_MACHINE_ID)) {
    throw new Error(
      `Invalid SNOWFLAKE_MACHINE_ID: expected 0..${MAX_MACHINE_ID.toString()}`
    );
  }
  if(snowflakeCustomEpoch < 0) {
    throw new Error(`Invalid SNOWFLAKE_CUSTOM_EPOCH: expected non-negative integer`);
  }
  if(snowflakeSequenceBits < 0 || snowflakeSequenceBits > Number(MAX_SEQUENCE)) {
    throw new Error(`Invalid SNOWFLAKE_SEQUENCE_BITS: expected 0..${MAX_SEQUENCE.toString()}`);
  }
}
validateSnowflakeConfig();

class Snowflake {
  private machineId: bigint;
  private sequence: bigint = 0n;
  private lastTimestamp: bigint = -1n;

  constructor(machineId: number) {
    const id = BigInt(machineId);

    if (id < 0n || id > MAX_MACHINE_ID) {
      throw new Error(
        `Invalid SNOWFLAKE_MACHINE_ID: expected 0..${MAX_MACHINE_ID.toString()}`
      );
    }

    this.machineId = id;
  }

  private currentTimestamp(): bigint {
    return BigInt(Date.now()) - CUSTOM_EPOCH;
  }

  // Wait until the next millisecond if we're still in the same timestamp and sequence has reached its max
  private waitNextMillis(lastTimestamp: bigint): bigint {
    let timestamp = this.currentTimestamp();

    while (timestamp <= lastTimestamp) {
      timestamp = this.currentTimestamp();
    }

    return timestamp;
  }

  private generateRaw(): bigint {
    let timestamp = this.currentTimestamp();

    if (timestamp < this.lastTimestamp) {
      throw new Error("Clock moved backwards");
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & MAX_SEQUENCE;//this ensures that if sequence exceeds max, it wraps around to 0

      //If sequence overflow,it becomes zero, wait for next millisecond
      if (this.sequence === 0n) {
        timestamp = this.waitNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;
    const id: bigint = (timestamp << TIMESTAMP_SHIFT) |
      (this.machineId << MACHINE_SHIFT) |
      this.sequence;
    return id;
  }
  get getId(): string {
    return this.generateRaw().toString();
  }
}

const snowflake = new Snowflake(snowflakeMachineId);

export const generateSnowflakeId = (): string => snowflake.getId;
