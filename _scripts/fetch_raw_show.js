// _scripts/fetch_raw_show.js
const fs = require('fs');
const path = require('path');
const PATHS = require('./utils/paths'); // Import our centralized paths

// Use the dynamic env path
require('dotenv').config({ path: PATHS.env });

const TMDB_TOKEN = process.env.TMDB_API_KEY;
const HEADERS = {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN}`
};

async function fetchTMDB(endpoint) {
    const url = `https://api.themoviedb.org/3${endpoint}`;
    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) throw new Error(`TMDB Error: ${response.statusText}`);
    return response.json();
}

async function downloadShowData(showName) {
    try {
        console.log(`Searching for "${showName}"...`);
        const searchData = await fetchTMDB(`/search/tv?query=${encodeURIComponent(showName)}`);
        
        if (searchData.results.length === 0) {
            console.log(`No results found for ${showName}`);
            return;
        }

        const showId = searchData.results[0].id;
        console.log(`Found ID: ${showId}. Fetching data...`);

        // Ensure the raw/shows directory exists using our centralized path
        if (!fs.existsSync(PATHS.rawShows)) {
            fs.mkdirSync(PATHS.rawShows, { recursive: true });
        }

        // 1. Fetch and save the master show details
        const showDetails = await fetchTMDB(`/tv/${showId}`);
        const masterFilePath = path.join(PATHS.rawShows, `${showId}_master.json`);
        fs.writeFileSync(masterFilePath, JSON.stringify(showDetails, null, 2));
        console.log(`Saved master details to: ${showId}_master.json`);
        
        // 2. Loop through the seasons, fetch, and save each individually
        for (const season of showDetails.seasons) {
            console.log(`Fetching Season ${season.season_number}...`);
            const seasonDetails = await fetchTMDB(`/tv/${showId}/season/${season.season_number}`);
            
            const seasonFilePath = path.join(PATHS.rawShows, `${showId}_season_${season.season_number}.json`);
            fs.writeFileSync(seasonFilePath, JSON.stringify(seasonDetails, null, 2));
            console.log(`Saved season to: ${showId}_season_${season.season_number}.json`);
        }

        console.log('\nSuccess! All raw data saved cleanly.');

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const showQuery = process.argv[2];
if (!showQuery) {
    console.log('Please provide a show name. Usage: node fetch_raw_show.js "Severance"');
} else {
    downloadShowData(showQuery);
}