
import app from './app.js';
import { connectDB } from './config/db.js';
import redisClient from './config/redis.js';

await connectDB(app);
await redisClient.connect();

