const fs = require('node:fs');
const path = require('node:path');

function displayFileInfo() {
    const filePath = path.join(__dirname, 'data', 'example.txt');

    if (!fs.existsSync(filePath)) {
        console.log(`File exists: no (${filePath})`);
        return null;
    }

    const fileStats = fs.statSync(filePath);
    const info = {
        exists: true,
        size: fileStats.size,
        createdAt: fileStats.birthtime
    };

    console.log(`File exists: ${info.exists}`);
    console.log(`File size: ${info.size} bytes`);
    console.log(`Created at: ${info.createdAt.toISOString()}`);
    return info;
}

module.exports = displayFileInfo;