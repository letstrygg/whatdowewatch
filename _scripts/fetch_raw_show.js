const fs = require('fs');
const path = require('path');
const PATHS = require('./utils/paths');
require('dotenv').config({ path: PATHS.env });

const TMDB_TOKEN = process.env.TMDB_API_KEY;
const HEADERS = { accept: 'application/json', Authorization: `Bearer ${TMDB_TOKEN}` };

async function fetchTMDB(endpoint) {
    const url = `https://api.themoviedb.org/3${endpoint}`;
    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) throw new Error(`TMDB Error: ${response.statusText}`);
    return response.json();
}

/**
 * Fetches raw TV data from TMDB and saves it to _data/raw/shows/
 * @param {string} showName - The name of the show to search for
 * @returns {Promise<number>} - The TMDB Show ID
 */
async function fetchRawShow(showName) {
    console.log(`Searching for "${showName}"...`);
    const searchData = await fetchTMDB(`/search/tv?query=${encodeURIComponent(showName)}`);
    
    if (searchData.results.length === 0) throw new Error(`No results found for ${showName}`);

    const showId = searchData.results[0].id;
    console.log(`Found ID: ${showId}. Fetching data...`);

    if (!fs.existsSync(PATHS.rawShows)) fs.mkdirSync(PATHS.rawShows, { recursive: true });

    const showDetails = await fetchTMDB(`/tv/${showId}`);
    fs.writeFileSync(path.join(PATHS.rawShows, `${showId}_master.json`), JSON.stringify(showDetails, null, 2));
    
    for (const season of showDetails.seasons) {
        if (season.season_number === 0) continue; // Optional: skip specials here too if desired
        console.log(`Fetching Season ${season.season_number}...`);
        const seasonDetails = await fetchTMDB(`/tv/${showId}/season/${season.season_number}`);
        fs.writeFileSync(path.join(PATHS.rawShows, `${showId}_season_${season.season_number}.json`), JSON.stringify(seasonDetails, null, 2));
    }

    return showId;
}

module.exports = fetchRawShow;