const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, price } = req.body;

  try {
    await pool.query(
      `UPDATE menu_items 
       SET name = $1, category = $2, price = $3
       WHERE id = $4`,
      [name, category, price, id]
    );

    res.json({ message: "Menu item updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

module.exports = router;
