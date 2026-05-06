import {generateSnowflakeId} from "./snowflake.js";
const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const BASE = 62;

export function generateShortId(): string {
    let shortUrl = "";
    let snowflakeId = BigInt(generateSnowflakeId());
    // Convert base-10 number to base-62 string
    while (snowflakeId > 0n) {
        let remainder = snowflakeId % BigInt(BASE);
        shortUrl = CHARSET[Number(remainder)] + shortUrl;
        snowflakeId = snowflakeId / BigInt(BASE);
    }
    return shortUrl;
}
