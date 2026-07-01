/** @file Centralized Express error handler. Registered last in app.js — converts Mongoose and validation errors to clean JSON responses. */

/** Converts known error types (CastError, ValidationError, duplicate key) to user-friendly HTTP responses. */
function errorHandler(err, req, res, next) {
  // Mongoose throws CastError when an invalid ObjectId is passed to findById
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Mongoose schema validation failure
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // Duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(400).json({ message: `${field} already exists` });
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
}

module.exports = errorHandler;
