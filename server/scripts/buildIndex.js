/**
 * סקריפט חד-פעמי לבניית ה-RAG index
 * תומך בהמשך מנקודת עצירה (checkpoint) במקרה של rate limit
 *
 * הרץ: node scripts/buildIndex.js
 * מייצר: server/data/embeddings.json
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const fs   = require("fs");
const path = require("path");

const regulations    = require("../data/regulations");
const procedures     = require("../data/procedures");
const departmentInfo = require("../data/departmentInfo");
const staff          = require("../data/staff");
const forms          = require("../data/forms");

const { chunkDocuments } = require("../rag/chunker");
const { embedText }      = require("../rag/embedder");
const { saveIndex }      = require("../rag/vectorStore");

const CHECKPOINT_PATH = path.join(__dirname, "../data/embeddings_checkpoint.json");

const DOCUMENTS = [
  { source: "תקנון אקדמי",   text: String(regulations) },
  { source: "נהלים",          text: String(procedures) },
  { source: "מידע מחלקתי",   text: String(departmentInfo) },
  { source: "סגל וצוות",     text: String(staff) },
  { source: "טפסים ומסמכים", text: String(forms) },
];

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function embedWithRetry(text, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await embedText(text);
    } catch (err) {
      const isRateLimit = err.message.includes("quota") || err.message.includes("429");
      if (isRateLimit && attempt < retries) {
        const wait = attempt * 10000; // 10s, 20s, 30s...
        console.log(`  ⏳ rate limit — ממתין ${wait / 1000}s (ניסיון ${attempt}/${retries})`);
        await sleep(wait);
      } else {
        throw err;
      }
    }
  }
}

async function build() {
  console.log(`📄 ${DOCUMENTS.length} קבצי מידע נטענו`);

  const chunks = chunkDocuments(DOCUMENTS, { chunkSize: 800, chunkOverlap: 100 });
  console.log(`✂️  נוצרו ${chunks.length} chunks`);

  // טעינת checkpoint אם קיים
  let done = {};
  if (fs.existsSync(CHECKPOINT_PATH)) {
    done = JSON.parse(fs.readFileSync(CHECKPOINT_PATH, "utf8"));
    console.log(`🔁 נמצא checkpoint — ממשיך מ-chunk ${Object.keys(done).length}`);
  }

  console.log("🔢 יוצר embeddings עם Gemini gemini-embedding-001...");

  for (let i = 0; i < chunks.length; i++) {
    if (done[i]) continue; // כבר עובד

    const embedding = await embedWithRetry(chunks[i].text);
    done[i] = embedding;

    // שמירת checkpoint כל 5 chunks
    if ((i + 1) % 5 === 0) {
      fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(done), "utf8");
      console.log(`  ✅ ${i + 1}/${chunks.length} chunks`);
    }

    // השהייה בין קריאות למנוע rate limit
    await sleep(800);
  }

  // בניית index סופי
  const index = chunks.map((chunk, i) => ({
    text: chunk.text,
    metadata: chunk.metadata,
    embedding: done[i],
  }));

  saveIndex(index);

  // מחיקת checkpoint
  if (fs.existsSync(CHECKPOINT_PATH)) {
    fs.unlinkSync(CHECKPOINT_PATH);
  }

  console.log("🎉 הבנייה הושלמה!");
}

build().catch((err) => {
  console.error("❌ שגיאה:", err.message);
  console.log("💡 הרץ שוב — הסקריפט ימשיך מנקודת העצירה.");
  process.exit(1);
});
