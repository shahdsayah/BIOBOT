/** @file Hebrew text normalization utilities for intent detection — strips prefixes, suffixes, and punctuation. */

/** Strips punctuation and collapses whitespace to prepare text for word-level comparison. */
function cleanHebrewText(text = "") {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"'()\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Strips common Hebrew prefixes (ו/ה/ב/ל...) and suffixes (ים/ות/ה...) to get the root
function normalizeHebrewWord(word = "") {
  return word
    .replace(/^[והבלכמש]+/, "")
    .replace(/(ים|ות|ה|י|ך|ם|ן|ף|ץ)$/g, "");
}

/** Cleans and normalizes every word in a text string using normalizeHebrewWord. */
function normalizeHebrewText(text = "") {
  return cleanHebrewText(text)
    .split(" ")
    .map(normalizeHebrewWord)
    .filter(Boolean)
    .join(" ");
}

// Normalizes both sides before comparing — prevents suffix/prefix mismatches
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