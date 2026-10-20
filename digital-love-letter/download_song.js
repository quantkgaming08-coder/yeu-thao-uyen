const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const audioDir = path.resolve('c:/Users/NGUYEN ANH QUAN/Downloads/digital-love-letter/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const url = 'https://archive.org/download/mot-doi-14-casper-bon-nghiem-buitruonglinh-gen-gi-gen-z-v.-a-playlist-nhac-cua-tui/m%E1%BB%99t%20%C4%91%E1%BB%9Di%20-%2014%20Casper%2C%20Bon%20Nghi%C3%AAm%2C%20buitruonglinh%20-%20Gen%20G%C3%AC%20Gen%20Z%20-%20V.A%20-%20Playlist%20NhacCuaTui.mp3';
const dest = path.join(audioDir, 'mot_doi.mp3');

console.log('Downloading Mot Doi MP3 to:', dest);
execSync(`curl.exe -L -s "${url}" -o "${dest}"`, { stdio: 'inherit' });

const size = fs.statSync(dest).size;
console.log('Successfully downloaded Mot Doi MP3. Size:', size, 'bytes');
