/** @file Shared date formatting utility — single locale-aware function used across all pages. */

/** Formats a date string to the user's locale. Falls back to "—" if the value is missing. @param {string} language - "he" or "ar" */
export function formatDate(dateString, language = "he") {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString(language === "ar" ? "ar" : "he-IL");
}
