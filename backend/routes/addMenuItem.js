const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// POST /api/menu/add-item
router.post('/add-item', async (req, res) => {
    const { name, category, price } = req.body;

    if (!name || !category || price === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const client = await pool.connect();
    try {
        const result = await client.query(
            `INSERT INTO menu_items (name, category, price)
             VALUES ($1, $2, $3) RETURNING *;`,
            [name, category, price]
        );

        res.status(201).json({ 
            message: "Menu item added successfully",
            id: result.rows[0].id
        });
    } catch (err) {
        console.error("Error adding menu item:", err);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        client.release();
    }
});

module.exports = router;