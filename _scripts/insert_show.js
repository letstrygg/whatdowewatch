const fs = require('fs');
const path = require('path');
const PATHS = require('./utils/paths');
const supabase = require('./utils/db');

async function insertShowToDb(showId) {
    const inputPath = path.join(PATHS.processedShows, `${showId}_processed.json`);

    if (!fs.existsSync(inputPath)) {
        throw new Error(`No processed data found for ID: ${showId}.`);
    }

    console.log(`Reading processed data for ID: ${showId}...`);
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    console.log(`Inserting ${data.items.length} items to Supabase...`);
    const { error: itemsError } = await supabase
        .from('items')
        .upsert(data.items, { onConflict: 'id' });

    if (itemsError) throw itemsError;
    console.log("✅ Items synced.");

    console.log(`Inserting ${data.connections.length} connections...`);
    const { error: connectionsError } = await supabase
        .from('item_connections')
        .upsert(data.connections, { onConflict: 'parent_id,child_id' }); 

    if (connectionsError) throw connectionsError;
    console.log("✅ Connections synced.");
}

module.exports = insertShowToDb;