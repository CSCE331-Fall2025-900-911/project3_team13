const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.patch('/', async (req, res) => {
    const { orderId, name } = req.body;

    if (!orderId) return res.status(400).json({ error: "Missing orderId" });

    try {
        const client = await pool.connect();

        const updateRes = await client.query(
            `UPDATE orders SET name = $1 WHERE id = $2 RETURNING id, name`,
            [name || 'Guest', orderId]
        );

        client.release();

        res.status(200).json({
            message: "Order name updated",
            order: updateRes.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
