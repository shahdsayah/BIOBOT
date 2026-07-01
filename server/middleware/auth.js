/** @file JWT authentication middleware. requireAuth verifies the token; requireAdmin also checks the admin role. */

const jwt = require("jsonwebtoken");

/** Verifies the Authorization Bearer token and attaches the decoded payload to req.user. */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/** Runs requireAuth first, then rejects non-admin users with 403. */
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  });
}

module.exports = { requireAuth, requireAdmin };
