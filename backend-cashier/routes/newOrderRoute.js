const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// start new order
router.post('/', async (req, resp) => {
    try {
        const client = await pool.connect();
        const lastOrderId = await client.query('SELECT MAX(id) FROM orders;');
        const res = await client.query('INSERT INTO orders (id, status, timestamp) VALUES ($1, $2, $3) RETURNING id;', [
            (lastOrderId.rows[0].max || 0) + 1,
            false,
            new Date().toISOString()
        ]);

        const orderId = res.rows[0].id;
        client.release();
        resp.status(201).json({ orderId: orderId });
    } catch(err) {
        console.error(err);
        resp.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;