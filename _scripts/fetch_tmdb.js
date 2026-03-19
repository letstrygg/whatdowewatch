const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'C:\\GitHub\\.env' });

const TMDB_TOKEN = process.env.TMDB_API_KEY;
const HEADERS = {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN}`
};

async function testFetch() {
    const showId = 95396; 
    const seasonNumber = 1;
    
    const url = `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}`;

    try {
        const response = await fetch(url, { headers: HEADERS });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Define where we want to save the file
        const dataDir = path.join(__dirname, '..', '_data');
        
        // Safety check: Create the _data folder if it doesn't exist
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }
        
        // Create the file path and write the JSON
        const filePath = path.join(dataDir, `severance_season_${seasonNumber}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        
        console.log(`Success! Data successfully saved to: ${filePath}`);
        
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

testFetch();