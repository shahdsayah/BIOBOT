/**
 * מפצל טקסט ל-chunks עם חפיפה
 * chunk_size=800  — מספיק לסעיף שלם
 * chunk_overlap=100 — לא לחתוך סעיפים באמצע
 */
function chunkText(text, { chunkSize = 800, chunkOverlap = 100 } = {}) {
  const separators = ["\n\n", "\n", ". ", " "];
  const chunks = [];

  function split(str, separatorIndex) {
    if (str.length <= chunkSize || separatorIndex >= separators.length) {
      return [str.trim()].filter(Boolean);
    }

    const sep = separators[separatorIndex];
    const parts = str.split(sep);
    const result = [];
    let current = "";

    for (const part of parts) {
      const candidate = current ? current + sep + part : part;

      if (candidate.length <= chunkSize) {
        current = candidate;
      } else {
        if (current) result.push(current.trim());
        current = part;
      }
    }

    if (current) result.push(current.trim());
    return result.filter(Boolean);
  }

  const rawChunks = split(text, 0);

  for (let i = 0; i < rawChunks.length; i++) {
    chunks.push(rawChunks[i]);

    // הוסף chunk עם חפיפה מה-chunk הקודם
    if (i > 0 && chunkOverlap > 0) {
      const prev = rawChunks[i - 1];
      const overlap = prev.slice(-chunkOverlap);
      const withOverlap = overlap + " " + rawChunks[i];

      if (withOverlap.length <= chunkSize * 1.2) {
        chunks[chunks.length - 1] = withOverlap.trim();
      }
    }
  }

  return chunks;
}

/**
 * מקבל מערך של { text, source } ומחזיר chunks עם metadata
 */
function chunkDocuments(documents, options = {}) {
  const result = [];

  for (const doc of documents) {
    const chunks = chunkText(doc.text, options);

    for (let i = 0; i < chunks.length; i++) {
      result.push({
        text: chunks[i],
        metadata: {
          source: doc.source || "unknown",
          chunkIndex: i,
          totalChunks: chunks.length,
        },
      });
    }
  }

  return result;
}

module.exports = { chunkText, chunkDocuments };
