const fs = require('fs');
const path = require('path');
const PATHS = require('./utils/paths');
const { mapShowToItem, mapSeasonToItem, mapEpisodeToItem } = require('./mappers/tmdb_mapper');

function processFullShow(showId) {
    const masterFilePath = path.join(PATHS.rawShows, `${showId}_master.json`);

    if (!fs.existsSync(masterFilePath)) {
        throw new Error(`Could not find raw data for ID: ${showId}.`);
    }

    console.log(`Processing data for ID: ${showId}...`);
    const masterData = JSON.parse(fs.readFileSync(masterFilePath, 'utf8'));
    
    const allItems = [];
    const allConnections = [];

    const showItem = mapShowToItem(masterData);
    allItems.push(showItem);

    for (const season of masterData.seasons) {
        if (season.season_number === 0) continue;

        const seasonFilePath = path.join(PATHS.rawShows, `${showId}_season_${season.season_number}.json`);
        
        if (!fs.existsSync(seasonFilePath)) {
            console.warn(`Warning: Missing file for Season ${season.season_number}`);
            continue;
        }

        const seasonData = JSON.parse(fs.readFileSync(seasonFilePath, 'utf8'));
        const mappedSeason = mapSeasonToItem(seasonData, showItem.id);
        
        allItems.push(mappedSeason.item);
        allConnections.push(mappedSeason.connection);

        if (seasonData.episodes) {
            for (const episode of seasonData.episodes) {
                const mappedEpisode = mapEpisodeToItem(episode, mappedSeason.item.id);
                allItems.push(mappedEpisode.item);
                allConnections.push(mappedEpisode.connection);
            }
        }
    }

    if (!fs.existsSync(PATHS.processedShows)) {
        fs.mkdirSync(PATHS.processedShows, { recursive: true });
    }

    const finalPayload = { items: allItems, connections: allConnections };
    const outputPath = path.join(PATHS.processedShows, `${showId}_processed.json`);
    
    fs.writeFileSync(outputPath, JSON.stringify(finalPayload, null, 2));
    console.log(`Success! Extracted ${allItems.length} items.`);
}

module.exports = processFullShow;