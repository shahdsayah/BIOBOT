const EMBEDDING_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent";

async function embedText(text) {
  const response = await fetch(`${EMBEDDING_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: { parts: [{ text }] },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Embedding failed: ${err.error?.message || "unknown"}`);
  }

  const data = await response.json();
  return data.embedding.values;
}

/**
 * יוצר embeddings לרשימת טקסטים בזה אחר זה
 * עם השהייה קטנה למנוע rate limit
 */
async function embedBatch(texts) {
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i++) {
    const embedding = await embedText(texts[i]);
    allEmbeddings.push(embedding);

    if ((i + 1) % 10 === 0) {
      console.log(`  embedded ${i + 1}/${texts.length} chunks`);
      // השהייה קטנה למנוע rate limit
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`  embedded ${texts.length}/${texts.length} chunks`);
  return allEmbeddings;
}

module.exports = { embedText, embedBatch };
