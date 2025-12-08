const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET /api/customers/:id/points
router.get("/:id/points", async (req, res) => {
    const customerId = req.params.id;

    try {
        const result = await pool.query(
            `SELECT id, name, points FROM customers WHERE id = $1`,
            [customerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Customer not found" });
        }

        const { id, name, points } = result.rows[0];

        res.json({ id, name, points });

    } catch (err) {
        console.error("Error fetching customer points:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
