const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// DELETE /api/order/item/:comboID
// Deletes one drink (combo) from the order
router.delete('/item/:comboID', async (req, res) => {
    const { comboID } = req.params;

    if (!comboID || isNaN(comboID)) {
        return res.status(400).json({ error: "Invalid or missing comboID" });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // First, delete related modifications from item_editing_table
        await client.query(
            'DELETE FROM item_editing_table WHERE comboid = $1;',
            [comboID]
        );

        // Then, delete the menu item from menu_item_order
        const result = await client.query(
            'DELETE FROM menu_item_order WHERE id = $1 RETURNING *;',
            [comboID]
        );

        await client.query('COMMIT');

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Item not found in menu_item_order" });
        }

        res.status(200).json({
            message: `Deleted comboID ${comboID} successfully.`,
            deletedItem: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error deleting menu item:", err);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
});

module.exports = router;
