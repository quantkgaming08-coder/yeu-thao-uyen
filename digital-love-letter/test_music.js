const fs = require('fs');
const content = fs.readFileSync('c:/Users/NGUYEN ANH QUAN/Downloads/digital-love-letter/index.html', 'utf8');

const scriptPos = content.indexOf('const bgAudio = document.getElementById(\'bg-music\');');
const audioTagPos = content.indexOf('<audio id="bg-music"');

console.log('Script pos:', scriptPos);
console.log('Audio tag pos:', audioTagPos);
console.log('Audio tag is AFTER script?', audioTagPos > scriptPos);
