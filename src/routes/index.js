import 'dotenv/config'
import express from 'express';
import { redisClient } from '../redis/redisClient.js';

// Use the Redis client passed from app.js
const router = express.Router();

export default (redis) => {
    // Login page
    router.get('/login', (req, res) => {
        const authCookie = req.cookies[process.env.AUTH_COOKIE_NAME]

        // Already login? 
        if (authCookie === 'true') {
            res.render('welcome', { dbsize: process.env.DBSIZE });
        }
        res.render('Login', { message: null } );
    })

    // Login 
    router.post('/login', (req, res) => {
        const { username, password } = req.body;
        
        if (username === process.env.ADMIN_USERNAME && 
            password === process.env.ADMIN_PASSWORD) {            
            res.cookie(process.env.AUTH_COOKIE_NAME, 'true', { maxAge: null }); 
            return res.redirect('/');
        }         
        res.render('Login', { message: 'Invalid credentials' } );
    });
    
    // Edit page
    router.get('/edit', async (req, res) => {
        const word = req.query.word;
        const authCookie = req.cookies[process.env.AUTH_COOKIE_NAME]

        if (authCookie === 'true') {
            // Render edit page
            const definition = await redisClient.hgetall(`DONGDICT:${word}`); // Fetch definition from Redis
            definition.key = word
            definition.description = definition.description.replace(/<br\s*\/?>/gi, '\n');
            res.render('edit', { definition }); 
            //res.render('detail', { definition });

        } else {
            res.redirect('/');
        }
    });

    // Save 
    router.post('/save', async (req, res) => {        
        const authCookie = req.cookies[process.env.AUTH_COOKIE_NAME]
        const { key, description } = req.body;

        if (authCookie === 'true') {
            // Save to Redis...
            await redisClient.hset(`DONGDICT:${key}`, "description", description.replace(/\n/g, '<br />') )
            
            res.redirect(`/detail?word=${key}`);
        } else {
            res.redirect('/');
        }
    });

    // Logout route
    router.get('/logout', (req, res) => {
        res.clearCookie(process.env.AUTH_COOKIE_NAME);
        res.redirect('/');
    });

    // Welcome Page
    router.get('/', async (req, res) => {
        await redisClient.ping()
        res.render('welcome', { dbsize: process.env.DBSIZE });
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
        const authCookie = req.cookies[process.env.AUTH_COOKIE_NAME]

        if (!word) {
            return res.redirect('/main');
        }

        try {            
            const definition = await redisClient.hgetall(`DONGDICT:${word}`); // Fetch definition from Redis
            definition.key = word
            definition.auth = authCookie
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
