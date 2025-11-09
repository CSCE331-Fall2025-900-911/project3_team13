// routes/cartRoute.js
const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /cart?orderID=10
// Returns all drinks (menu items) in a given order
//ONLY drinks for now
//TODO : expand to include modifications probably sprint 2
router.get('/', async (req, res) => {
  const { orderID } = req.query; 

  if (!orderID) {
    return res.status(400).json({ error: 'Missing orderID parameter' });
  }

  try {
    // Join menu_item_order and menu_items to get names of drinks in that order
    const result = await pool.query(
      `
      SELECT 
        m.name AS drink_name,
        m.price,
        mio.id AS combo_id
      FROM menu_item_order mio
      JOIN menu_items m ON mio.menuitemid = m.id
      WHERE mio.orderid = $1
      ORDER BY mio.id ASC;
      `,
      [orderID]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No drinks found for this order.' });
    }

    res.status(200).json({
      orderID,
      items: result.rows
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Error retrieving drinks for order' });
  }
});

module.exports = router;
