const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// ========================================================
// GET /api/customer-loyalty?customerId=123
// Returns: { free_drinks: number }
// ========================================================
router.get('/', async (req, res) => {
    const customerId = Number(req.query.customerId);

    if (!customerId) {
        return res.status(400).json({ error: "Missing customerId" });
    }
    if (customerId === 1) {
        return res.json({ free_drinks: 0, points: 0 });
    }
    
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT free_drinks, points 
             FROM customers
             WHERE id = $1`,
            [customerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Customer not found" });
        }

        return res.json({
            free_drinks: result.rows[0].free_drinks,
            points: result.rows[0].points
        });
    } catch (err) {
        console.error("Error fetching loyalty data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
});

module.exports = router;
