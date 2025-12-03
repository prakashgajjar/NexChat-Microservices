import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

const PATH =  "../../.env" ;
dotenv.config({ path:PATH});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

(async () => {
  try {
    await redis.ping();
    console.log("->>>Connected to Upstash Redis successfully!");
  } catch (err) {
    console.error("->>>Failed to connect to Upstash Redis:", err.message);
  }
})();

export default redis;
