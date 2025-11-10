// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/get-menu-items?category=Milk%20Tea
//%20 is URL encoding for space
// Returns all drinks in the specified category
router.get('/', async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: 'Missing category parameter' });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, name, category, price
      FROM menu_items
      WHERE LOWER(category) = LOWER($1)
      ORDER BY id ASC;
      `,
      [category]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No drinks found in category '${category}'` });
    }

    res.status(200).json({
      category,
      count: result.rowCount,
      drinks: result.rows
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Error fetching menu items' });
  }
});

module.exports = router;
