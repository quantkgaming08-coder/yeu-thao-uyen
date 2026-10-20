const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const baseDir = path.resolve('c:/Users/NGUYEN ANH QUAN/Downloads/digital-love-letter');
const imgDir = path.join(baseDir, 'images');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

const htmlFile = path.join(baseDir, 'screen_07c5e4ed.html');
const htmlContent = fs.readFileSync(htmlFile, 'utf8');

// Regex to find all src="https://..."
const regex = /src=["'](https?:\/\/[^"']+)["']/g;
let match;
const urls = [];
while ((match = regex.exec(htmlContent)) !== null) {
  if (!match[1].includes('cdn.tailwindcss.com')) {
    urls.push(match[1]);
  }
}

console.log(`Found ${urls.length} images to download.`);

const mapping = {};
urls.forEach((url, index) => {
  const ext = url.includes('.png') ? 'png' : 'jpg';
  const filename = `image_${String(index).padStart(2, '0')}.${ext}`;
  const destPath = path.join(imgDir, filename);
  mapping[url] = `images/${filename}`;

  console.log(`Downloading [${index + 1}/${urls.length}] ${filename}...`);
  try {
    execSync(`curl.exe -L -s "${url}" -o "${destPath}"`, { stdio: 'inherit' });
    const stat = fs.statSync(destPath);
    console.log(`Saved ${filename}: ${stat.size} bytes`);
  } catch (err) {
    console.error(`Error downloading ${filename}:`, err.message);
  }
});

fs.writeFileSync(path.join(baseDir, 'image_mapping.json'), JSON.stringify(mapping, null, 2));

// Create a local self-contained version of the web page
let localHtml = htmlContent;
for (const [url, localPath] of Object.entries(mapping)) {
  localHtml = localHtml.split(url).join(localPath);
}

fs.writeFileSync(path.join(baseDir, 'index.html'), localHtml, 'utf8');
console.log('Successfully created local index.html with all images wired up!');
