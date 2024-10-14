import express from 'express';
import { redisClient } from '../redis/redisClient.js';

// Use the Redis client passed from app.js
const router = express.Router();

export default (redis) => {
    // Welcome Page
    router.get('/', async (req, res) => {
        await redisClient.ping()
        res.render('welcome');
    });

    // Main Page - List prefix-matched words
    router.post('/main', async (req, res) => {
        const searchTerm = req.body.word.toLowerCase().trim();
        //const matchedWords = await redisClient.keys(`DONGDICT:${searchTerm}*`); // Fetch keys matching the prefix
        const matchedWords = await fetchKeys(searchTerm)
        const words = matchedWords.map(word => word.replace(/^DONGDICT:/, ''));
        
        res.render('main', { matchedWords: words, searchTerm });
    });

    // Detail Page - Show word definition
    router.get('/detail', async (req, res) => {
        const word = req.query.word;
        if (!word) {
            return res.redirect('/main');
        }

        try {            
            const definition = await redisClient.hgetall(`DONGDICT:${word}`); // Fetch definition from Redis
            definition.key = word
            res.render('detail', { definition });
        } catch (error) {
            console.error(error);
            res.render('detail', { definition: null });
        }
    });

    return router;
};

async function fetchKeys(searchTerm, count=1000) {
    let cursor = '0';
    const keys = [];
    const pattern = `DONGDICT:${searchTerm}*`;

    do {
        // Scan for keys in batches of 1000
        const result = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', count);
        cursor = result[0]; // Update the cursor for the next iteration
        keys.push(...result[1]); // Add the found keys to the array
    } while (cursor !== '0'); // Continue until the cursor is back to 0

    return keys;
}
