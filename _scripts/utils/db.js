// _scripts/utils/db.js
const { createClient } = require('@supabase/supabase-js');
const PATHS = require('./paths');

// Load environment variables using our paths utility
require('dotenv').config({ path: PATHS.env });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env file.");
    process.exit(1);
}

// Initialize the client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;