/** @file RAG retriever: embeds the user's question and returns the top-k most relevant knowledge chunks via cosine similarity. */

const { embedText } = require("./embedder");
const { loadIndex } = require("./vectorStore");

// Index is loaded once into memory — not re-read from disk on every request
let _index = null;

/** Loads the vector index from disk on first call, then caches it in memory. */
function getIndex() {
  if (!_index) {
    _index = loadIndex();
    if (!_index) {
      throw new Error("RAG index not found. Run `node scripts/buildIndex.js` first.");
    }
    console.log(`✅ RAG index loaded: ${_index.length} chunks`);
  }
  return _index;
}

// Cosine similarity between two embedding vectors
function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Returns the top-k most relevant chunks for a given question
async function retrieve(question, topK = 4) {
  const index = getIndex();

  let questionEmbedding;
  try {
    questionEmbedding = await embedText(question);
  } catch {
    // Embedding API failed — fall back to simple keyword search
    const q = question.toLowerCase();
    const keyword = index
      .map((entry) => ({ ...entry, score: entry.text.toLowerCase().includes(q) ? 1 : 0 }))
      .sort((a, b) => b.score - a.score);
    return keyword.slice(0, topK);
  }

  const scored = index.map((entry) => ({
    text: entry.text,
    metadata: entry.metadata,
    score: cosineSimilarity(questionEmbedding, entry.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

// Returns retrieved chunks joined as plain text, ready to inject into the Gemini prompt
async function retrieveAsText(question, topK = 4) {
  const chunks = await retrieve(question, topK);

  return chunks
    .map((c, i) => `[${i + 1}] (מקור: ${c.metadata.source})\n${c.text}`)
    .join("\n\n---\n\n");
}

// Clears the cached index so it reloads on the next request (e.g. after rebuilding embeddings)
function resetIndex() {
  _index = null;
}

module.exports = { retrieve, retrieveAsText, resetIndex };
