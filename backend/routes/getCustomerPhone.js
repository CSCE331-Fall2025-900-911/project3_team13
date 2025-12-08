const express = require('express');
const router = express.Router();
const pool = require('../db/pool');





router.get('/', async (req, res) => {
  const phone = req.query.phone;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT id, name FROM customers WHERE phone = $1 LIMIT 1;',
      [phone]
    );
    client.release();

    if (result.rows.length > 0) {
      res.json({
        found: true,
        customer: {
          id: result.rows[0].id,
          name: result.rows[0].name,
        }
      });
    } else {
      res.json({ found: false });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;