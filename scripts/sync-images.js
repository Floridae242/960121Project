import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, '../backend/seed.sql');
const jsonPath = path.join(__dirname, '../public/workshops.json');

const seedContent = fs.readFileSync(seedPath, 'utf8');
const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Let's parse each INSERT statement for workshops
const workshopInsertRegex = /INSERT INTO workshops\s*\([^)]*\)\s*VALUES\s*([\s\S]*?);/i;
const match = seedContent.match(workshopInsertRegex);
if (!match) {
  console.error("Could not find INSERT INTO workshops in seed.sql");
  process.exit(1);
}

const valuesBlock = match[1];
const lines = valuesBlock.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const imageMap = {};

lines.forEach(line => {
  let cleaned = line;
  if (cleaned.startsWith('(')) cleaned = cleaned.substring(1);
  if (cleaned.endsWith(',')) cleaned = cleaned.substring(0, cleaned.length - 1);
  if (cleaned.endsWith(')')) cleaned = cleaned.substring(0, cleaned.length - 1);

  // Split by single quote
  const parts = cleaned.split("'");
  const idPart = parts[0].trim();
  const id = parseInt(idPart.split(',')[0].trim(), 10);
  
  // Find the URL part
  const urlPart = parts.find(p => p.startsWith('http') || p.startsWith('/images'));
  if (urlPart && !isNaN(id)) {
    imageMap[id] = urlPart;
  }
});

console.log("Extracted images for IDs:", Object.keys(imageMap).length);

// Update JSON
let updatedCount = 0;
jsonContent.forEach(item => {
  if (imageMap[item.id]) {
    if (item.image !== imageMap[item.id]) {
      console.log(`Updating ID ${item.id}: ${item.image} -> ${imageMap[item.id]}`);
      item.image = imageMap[item.id];
      updatedCount++;
    }
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2), 'utf8');
console.log(`Successfully synchronized workshops.json! Updated ${updatedCount} images.`);
