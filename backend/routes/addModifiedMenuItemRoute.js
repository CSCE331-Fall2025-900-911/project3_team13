const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// Add modified menu item to order
router.post('/', async (req, res) => {
    // requests to this route should contain order ID, menu item ID, and a list of modifications
    // ideally the modifications should be of the form [{itemName: "item name", quantity: x}, ...]
    const { orderId, menuItemId, sugar, ice, size, shots, notes } = req.body;

    const client = await pool.connect();

    try {
        // Start a transaction
        await client.query('BEGIN');

        // Lock the table so MAX(id) + 1 calculation is safe
        await client.query('LOCK TABLE menu_item_order IN EXCLUSIVE MODE;');

        // Get the current max ID
        const lastIdRes = await client.query('SELECT MAX(id) AS max FROM menu_item_order;');
        const menuItemOrderId = (lastIdRes.rows[0].max || 0) + 1;

        // Insert into menu_item_order
        await client.query(
            'INSERT INTO menu_item_order (id, menuitemid, orderid) VALUES ($1, $2, $3);',
            [menuItemOrderId, menuItemId, orderId]
        );

        // Insert modifications into item_editing_table
        await client.query(
            'INSERT INTO item_editing_table (comboid, sugar, ice, size, shots, notes) VALUES ($1, $2, $3, $4, $5, $6);',
            [menuItemOrderId, sugar, ice, size, shots, notes ? notes.trim() : '']
        );

        // Commit the transaction
        await client.query('COMMIT');

        res.status(201).json({ message: 'Item added to order successfully', comboId: menuItemOrderId });
    } catch (err) {
        // Rollback if anything goes wrong
        await client.query('ROLLBACK');
        console.error('Error adding modified menu item:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
})
module.exports = router;