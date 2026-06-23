const { embedText } = require("./embedder");
const { loadIndex } = require("./vectorStore");

// ה-index נטען פעם אחת לזיכרון (לא מהדיסק בכל שאלה)
let _index = null;

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

/**
 * Cosine similarity בין שני וקטורים
 */
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

/**
 * מקבל שאלה + מספר תוצאות
 * מחזיר top-k chunks הכי רלוונטיים
 *
 * @param {string} question
 * @param {number} topK - כמה chunks להחזיר (ברירת מחדל 4)
 * @returns {Promise<Array<{ text, metadata, score }>>}
 */
async function retrieve(question, topK = 4) {
  const index = getIndex();
  const questionEmbedding = await embedText(question);

  const scored = index.map((entry) => ({
    text: entry.text,
    metadata: entry.metadata,
    score: cosineSimilarity(questionEmbedding, entry.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

/**
 * מחזיר טקסט מאוחד של ה-chunks (לשימוש ב-prompt)
 */
async function retrieveAsText(question, topK = 4) {
  const chunks = await retrieve(question, topK);

  return chunks
    .map((c, i) => `[${i + 1}] (מקור: ${c.metadata.source})\n${c.text}`)
    .join("\n\n---\n\n");
}

// מאפשר ריסט של ה-index בזיכרון (לדוגמה אחרי buildIndex חדש)
function resetIndex() {
  _index = null;
}

module.exports = { retrieve, retrieveAsText, resetIndex };
