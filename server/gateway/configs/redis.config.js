import { createClient } from "redis";

const redis = createClient({
  url: "redis://localhost:6379", // or your redis server URL
});

redis.on("error", (err) => console.error("Redis Error:", err));
await redis.connect();

export default redis;
