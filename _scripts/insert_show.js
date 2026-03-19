// _scripts/upload_show.js
const fs = require('fs');
const path = require('path');
const PATHS = require('./utils/paths');
const supabase = require('./utils/db'); // Import our new database client

async function uploadProcessedShow(showId) {
    const inputPath = path.join(PATHS.processedShows, `${showId}_processed.json`);

    if (!fs.existsSync(inputPath)) {
        console.error(`Could not find processed data at ${inputPath}. Did you run the process script?`);
        return;
    }

    console.log(`Reading processed data for ID: ${showId}...`);
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    // 1. Upload the Items
    console.log(`Uploading ${data.items.length} items to Supabase...`);
    const { error: itemsError } = await supabase
        .from('items')
        .upsert(data.items, { onConflict: 'id' }); // Update if ID already exists

    if (itemsError) {
        console.error("Failed to upload items:", itemsError);
        return;
    }
    console.log("✅ Items uploaded successfully.");

    // 2. Upload the Connections
    console.log(`Uploading ${data.connections.length} connections to Supabase...`);
    const { error: connectionsError } = await supabase
        .from('item_connections')
        .upsert(data.connections, { onConflict: 'parent_id,child_id' }); 

    if (connectionsError) {
        console.error("Failed to upload connections:", connectionsError);
        return;
    }
    console.log("✅ Connections uploaded successfully.");
    console.log("\nAll done! Check your Supabase dashboard.");
}

const showId = process.argv[2];
if (!showId) {
    console.log('Please provide a show ID. Usage: node upload_show.js 95396');
} else {
    uploadProcessedShow(showId);
}