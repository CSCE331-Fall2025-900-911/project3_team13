const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /inventory/get-item?itemID=<item id>
router.get('/get-item', async (req, res) => {
    const { itemID } = req.query;

    try {
        const client = await pool.connect();
        const itemSearchRes = await pool.query('SELECT id, name, category, price FROM menu_items WHERE id = $1', [itemID]);

        res.status(200).json({
            id: itemID,
            name: itemSearchRes.rows[0].name,
            category: itemSearchRes.rows[0].category,
            price: parseFloat(itemSearchRes.rows[0].price)
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/** 
 * PATCH /update-item, pass in JSON object of:
 * {
 *  itemID
 *  attribute
 *  value
 * }
*/
router.patch('/update-item', async (req, res) => {
    const { itemID, attribute, value } = req.body;
    try {
        const client = await pool.connect();

        await client.query('UPDATE menu_items SET ' + attribute + ' = $1 WHERE id = $2', [
            value,
            itemID
        ]);

        res.status(200).json({ message: "Item updated successfully" });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// add delete item from inventory
router.delete('/delete-item', async (req, res) => {
    const { itemID } = req.query;

    try {
        const client = await pool.connect();
        await client.query('DELETE FROM menu_items WHERE id = $1', [itemID]);

        res.status(200).json({ message: "Item deleted successfully" });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// add add new item to inventory
router.post('/add-item', async (req, res) => {
    const { name, category, price } = req.body;
    const modificationsStr = "{'Sugar': ['0%', '25%', '50%', '100%', '150%', '200%']," +
                                "'Ice': ['0%', '25%', '50%', '100%', '150%', '200%']," + 
                                "'Size': ['Small', 'Medium', 'Large']," +
                                "'Shots': ['0', '1', '2', '3', '4', '5']}";

    try {
        const client = await pool.connect();
        await client.query('INSERT INTO menu_items (name, category, price, modifications) VALUES ($1, $2, $3, $4)', [
            name,
            category,
            price,
            modificationsStr
        ]);

        res.status(200).json({ message: "Item added successfully" });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;