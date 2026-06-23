const fs = require("fs");
const path = require("path");

const INDEX_PATH = path.join(__dirname, "../data/embeddings.json");

/**
 * שומר את ה-index לדיסק
 * index = [{ text, metadata, embedding }]
 */
function saveIndex(index) {
  fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), "utf8");
  console.log(`✅ index נשמר: ${index.length} chunks → ${INDEX_PATH}`);
}

/**
 * טוען את ה-index מהדיסק
 * מחזיר null אם הקובץ לא קיים
 */
function loadIndex() {
  if (!fs.existsSync(INDEX_PATH)) return null;
  const raw = fs.readFileSync(INDEX_PATH, "utf8");
  return JSON.parse(raw);
}

/**
 * בודק אם ה-index כבר קיים
 */
function indexExists() {
  return fs.existsSync(INDEX_PATH);
}

module.exports = { saveIndex, loadIndex, indexExists };
