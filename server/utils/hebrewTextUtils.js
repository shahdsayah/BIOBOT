function cleanHebrewText(text = "") {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"'()\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeHebrewWord(word = "") {
  return word
    .replace(/^[והבלכמש]+/, "")
    .replace(/(ים|ות|ה|י|ך|ם|ן|ף|ץ)$/g, "");
}

function normalizeHebrewText(text = "") {
  return cleanHebrewText(text)
    .split(" ")
    .map(normalizeHebrewWord)
    .filter(Boolean)
    .join(" ");
}

function includesHebrewMatch(text = "", query = "") {
  const normalizedText = normalizeHebrewText(text);
  const normalizedQuery = normalizeHebrewText(query);

  return normalizedText.includes(normalizedQuery);
}

module.exports = {
  cleanHebrewText,
  normalizeHebrewWord,
  normalizeHebrewText,
  includesHebrewMatch,
};