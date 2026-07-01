/** @file Persistence layer for the RAG vector index: reads and writes the embedded chunks to embeddings.json. */

const fs = require("fs");
const path = require("path");

const INDEX_PATH = path.join(__dirname, "../data/embeddings.json");


function saveIndex(index) {
  fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), "utf8");
  console.log(`✅ index נשמר: ${index.length} chunks → ${INDEX_PATH}`);
}


function loadIndex() {
  if (!fs.existsSync(INDEX_PATH)) return null;
  const raw = fs.readFileSync(INDEX_PATH, "utf8");
  return JSON.parse(raw);
}


function indexExists() {
  return fs.existsSync(INDEX_PATH);
}

module.exports = { saveIndex, loadIndex, indexExists };
