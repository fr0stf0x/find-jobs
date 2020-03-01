// Express app
require('dotenv').config();
const express = require('express');
const app = express();

const Redis = require('redis');
const {promisify} = require('util');

// Redis client
const redisClient = Redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);

// Config
const PORT = 3001;

// Redis key for jobs
const githubJobRedisKey = 'github:jobs';

// Routes
app.get('/api/jobs', async (req, res) => {
    const jobs = JSON.parse(await getAsync(githubJobRedisKey));
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');

    return res.json(jobs);
});

app.listen(PORT, () => {
    console.log('Listening on', PORT);
})
