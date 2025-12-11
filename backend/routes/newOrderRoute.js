const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// start new order
router.post('/', async (req, resp) => {
    const client = await pool.connect();
    try {
        const res = await client.query('INSERT INTO orders (status, timestamp) VALUES ($1, $2) RETURNING id;', [
            'pending',
            new Date().toISOString()
        ]);

        const orderId = res.rows[0].id;
        resp.status(201).json({ orderId: orderId });
    } catch(err) {
        console.error(err);
        resp.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
});

module.exports = router;