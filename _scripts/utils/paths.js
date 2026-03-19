// _scripts/utils/paths.js
const path = require('path');

// Since this file lives in _scripts/utils/, going up two levels hits the project root
const PROJECT_ROOT = path.join(__dirname, '..', '..');

const PATHS = {
    root: PROJECT_ROOT,
    env: path.join(PROJECT_ROOT, '..', '.env'), // One level above root (C:\GitHub\.env)
    data: path.join(PROJECT_ROOT, '_data'),
    rawShows: path.join(PROJECT_ROOT, '_data', 'raw', 'shows'),
	processedShows: path.join(PROJECT_ROOT, '_data', 'processed', 'shows')
};

module.exports = PATHS;