const fetchRawShow = require('./fetch_raw_show');
const processFullShow = require('./process_show');
const insertShowToDb = require('./insert_show');

async function runPipeline() {
    const showName = process.argv[2];
    if (!showName) return console.log('Usage: node _scripts/add_show.js "Show Name"');

    try {
        console.log(`=== STARTING PIPELINE: ${showName} ===`);
        
        // Step 1: Fetch
        const showId = await fetchRawShow(showName);

        // Step 2: Process
        console.log(`\n=== STEP 2: PROCESSING ===`);
        processFullShow(showId);

        // Step 3: Insert
        console.log(`\n=== STEP 3: DATABASE INSERT ===`);
        await insertShowToDb(showId);

        console.log(`\n✅ ALL DONE: ${showName} is fully processed and live.`);
    } catch (error) {
        console.error(`\n❌ Pipeline failed:`, error.message);
    }
}

runPipeline();