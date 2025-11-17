const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET /api/order-list?status=completed
//%20 is URL encoding for space
router.get("/", async (req, res) => {
    const { status } = req.query;
    const allowed = [
        "pending", 
        "completed", 
        "canceled",
        "in progress",
        "ready to pay"
        ];

    if (!allowed.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }
    if (!status) {
        return res.status(400).json({ error: "Missing status parameter" });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM orders WHERE status = $1 ORDER BY timestamp DESC`,
            [status]
        );

        res.json({ orders: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
