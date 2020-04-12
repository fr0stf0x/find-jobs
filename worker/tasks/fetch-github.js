const fetch = require('node-fetch');
const Redis = require('redis');
const {promisify} = require('util');

// Redis client
const redisClient = Redis.createClient({
    auth_pass: 'r7sYSshHaSE11VgRrIjoqD3t9sMUaiTKie3bBUZqcBuOJMXugxUnwJJq9EclSzSYCD+gc7rByhxtIBFC'
});
const setAsync = promisify(redisClient.set).bind(redisClient);

// Fetch url
const baseURL = 'https://jobs.github.com/positions.json';

// Redis key for jobs
const githubJobRedisKey = 'github:jobs';

// Fetch jobs from Github
async function fetchGithub () {
    let resultCount = 1, page = 1;
    const allJobs = [];

    // Fetch all pages
    while (resultCount > 0) {
        const res = await fetch(`${baseURL}?page=${page}`);
        const jobs = await res.json();

        console.log("OUTPUT: fetched", jobs.length, 'jobs');

        resultCount = jobs.length;
        allJobs.push(...jobs);
        page++;
    }

    console.log('got total', allJobs.length);

    const jrJobs = allJobs.filter(job => {
        let isJunior = true;
        const jobTitle = job.title.toLowerCase();

        if (
            jobTitle.includes('senior') ||
            jobTitle.includes('manager') ||
            jobTitle.includes('sr.') ||
            jobTitle.includes('architect')
        ) {
            isJunior = false;
        }

        return isJunior;
    });

    console.log('filtered out', jrJobs.length, 'jr jobs');

    // Save to redis
    const success = await setAsync(githubJobRedisKey, JSON.stringify(jrJobs));

    console.log({success});
}

module.exports = fetchGithub;
