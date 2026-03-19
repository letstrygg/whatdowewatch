const fs = require('fs');
const path = require('path');
const PATHS = require('./utils/paths');
const { mapShowToItem, mapSeasonToItem, mapEpisodeToItem } = require('./mappers/tmdb_mapper');

function processFullShow(showId) {
    const masterFilePath = path.join(PATHS.rawShows, `${showId}_master.json`);

    if (!fs.existsSync(masterFilePath)) {
        console.error(`Could not find raw data at ${masterFilePath}. Run fetch script first.`);
        return;
    }

    console.log(`Processing data for ID: ${showId}...`);
    const masterData = JSON.parse(fs.readFileSync(masterFilePath, 'utf8'));
    
    const allItems = [];
    const allConnections = [];

    // 1. Process Master Show
    const showItem = mapShowToItem(masterData);
    allItems.push(showItem);

    // 2. Loop through the seasons listed in the master file
    for (const season of masterData.seasons) {
        // We skip season 0 (usually behind-the-scenes/specials) to keep data clean
        if (season.season_number === 0) continue;

        const seasonFilePath = path.join(PATHS.rawShows, `${showId}_season_${season.season_number}.json`);
        
        if (!fs.existsSync(seasonFilePath)) {
            console.warn(`Warning: Missing file for Season ${season.season_number}`);
            continue;
        }

        const seasonData = JSON.parse(fs.readFileSync(seasonFilePath, 'utf8'));

        // Map the season and its connection to the show
        const mappedSeason = mapSeasonToItem(seasonData, showItem.id);
        allItems.push(mappedSeason.item);
        allConnections.push(mappedSeason.connection);

        // Map the episodes and their connections to the season
        if (seasonData.episodes) {
            for (const episode of seasonData.episodes) {
                const mappedEpisode = mapEpisodeToItem(episode, mappedSeason.item.id);
                allItems.push(mappedEpisode.item);
                allConnections.push(mappedEpisode.connection);
            }
        }
    }

    // 3. Save the final clean schema
    if (!fs.existsSync(PATHS.processedShows)) {
        fs.mkdirSync(PATHS.processedShows, { recursive: true });
    }

    const finalPayload = {
        items: allItems,
        connections: allConnections
    };

    const outputPath = path.join(PATHS.processedShows, `${showId}_processed.json`);
    fs.writeFileSync(outputPath, JSON.stringify(finalPayload, null, 2));
    
    console.log(`Success! Extracted ${allItems.length} total items (Shows/Seasons/Episodes).`);
    console.log(`Clean data saved to: ${outputPath}`);
}

const showId = process.argv[2];
if (!showId) {
    console.log('Please provide a show ID. Usage: node process_show.js 95396');
} else {
    processFullShow(showId);
}