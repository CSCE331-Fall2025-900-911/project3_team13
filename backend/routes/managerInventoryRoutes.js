const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET api/inventory/get-all-items
router.get('/get-all-items', async (req, res) => {
    try {
        const client = await pool.connect();
        const inventoryRes = await client.query('SELECT * FROM inventory ORDER BY id ASC;');

        res.status(200).json({ items: inventoryRes.rows });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// DELETE api/inventory/delete-item?id=<item id>
router.delete('/delete-item', async (req, res) => {
    const { id } = req.query;

    if(!id) {
        return res.status(400).json({ error: 'Missing id parameter' });
    }

    try {
        const client = await pool.connect();
        const deleteRes = await client.query('DELETE FROM inventory WHERE id = $1 RETURNING id;', [id]);
		if (deleteRes.rowCount === 0) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json({ message: "Item deleted successfully", id: deleteRes.rows[0].id });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST api/inventory/add-item (body; { name, quantity })
router.post('/add-item', async (req, res) => {
    const { name, quantity } = req.body;

    if(!name || !quantity) {
        return res.status(400).json({ message: "Invalid/missing name or quantity" });
    }

    try {
        const client = await pool.connect();
        const insertRes = await client.query('INSERT INTO inventory (name, quantity) VALUES ($1, $2) RETURNING id', [
            name,
            quantity
        ]);
        res.status(201).json({ message: "Item added successfully", id: insertRes.rows[0].id, name });
    } catch(error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// PATCH api/inventory/update-quantity (body: { id, quantity })
router.patch('/update-quantity', async (req, res) => {
    const { id, quantity } = req.body;

    if(!id || !quantity) {
        return res.status(400).json({ message: "Missing/invalid ID or quantity" });
    }

    try {
        const client = await pool.connect();
        const updateRes = await client.query('UPDATE inventory SET quantity = $1 WHERE id = $2 RETURNING id;', [quantity, id]);
		if (updateRes.rowCount === 0) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json({ message: "Item updated successfully", id: updateRes.rows[0].id, quantity }); 
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET /get-low-quantity
router.get('/get-low-quantity', async (req, res) => {
    try {
        const client = await pool.connect();
        const lowQuantityRes = await client.query('SELECT name, quantity FROM inventory WHERE quantity < 10;');
        res.status(200).json({ message: "Items obtained successfully", lowQuantityItems: lowQuantityRes.rows });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router;