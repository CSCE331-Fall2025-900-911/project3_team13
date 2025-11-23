// Checks if user is logged in
function requireLogin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
}

// Checks if logged-in user has required role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not logged in" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

module.exports = {
  requireLogin,
  requireRole,
};
