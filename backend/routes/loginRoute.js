const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// -----------------------------------------
// POST /api/login/cashier
// -----------------------------------------
router.post("/cashier", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT id, name, username, password, role
       FROM users
       WHERE username = $1 
         AND password = $2`,
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];

    if (user.role !== "cashier") {
      return res.status(403).json({ message: "Access denied: Not a cashier" });
    }

    return res.status(200).json({ message: "Login successful", user });

  } catch (err) {
    console.error("Error during cashier login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -----------------------------------------
// POST /api/login/manager
// -----------------------------------------
router.post("/manager", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT id, name, username, password, role
       FROM users
       WHERE username = $1 
         AND password = $2`,
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];

    if (user.role !== "manager") {
      return res.status(403).json({ message: "Access denied: Not a manager" });
    }

    return res.status(200).json({ message: "Login successful", user });

  } catch (err) {
    console.error("Error during manager login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
