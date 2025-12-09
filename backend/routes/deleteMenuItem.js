const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// DELETE menu item by ID
router.delete('/delete-item/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM menu_items WHERE id = $1 RETURNING *;',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item deleted", deleted: result.rows[0] });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
