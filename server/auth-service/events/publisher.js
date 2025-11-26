// auth-service/events/publisher.js
import { createClient } from "redis";
const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

export const publishUserEvent = async (eventType, data) => {
  await redis.publish("user-events", JSON.stringify({ type: eventType, data }));
};
