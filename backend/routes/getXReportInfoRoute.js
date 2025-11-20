const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        const query = "SELECT EXTRACT(HOUR FROM timestamp) AS hour, SUM(total) AS total_sales FROM transactions WHERE timestamp >= CURRENT_DATE AND timestamp <  CURRENT_DATE + INTERVAL '1 day' GROUP BY hour ORDER BY hour;";
        const salesRes = await client.query(query);

        res.status(200).json({ salesInfo: salesRes.rows });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;