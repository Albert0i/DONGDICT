import 'dotenv/config'
import { Redis } from 'ioredis'

/**
 * Create a Redis instance. 
 * @returns {redisClient} The Redis Client instance 
 */
const redisClient = new Redis({
    port: process.env.REDIS_PORT,         // Redis port
    host: process.env.REDIS_HOST,         // Redis host
    password: process.env.REDIS_PASSWORD, // Redis password 

    showFriendlyErrorStack: true,         // Optimize the error stack displayed
    db: 0,                                // Logical database (0~15), defaults to 0
  });

/**
 * Close Redis connection
 * @returns {null} 
 */
const disconnect = () => {
  redisClient.disconnect()
}

export { redisClient, disconnect }

/*
   ioredis
   https://github.com/redis/ioredis?tab=readme-ov-file
*/