const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.post('/', async (req, res) => {
    const { orderId, customerId, employeeId } = req.body;

    try {
        const client = await pool.connect();
        // get order timestamp
        const orderTimestampRes = await client.query('SELECT timestamp FROM orders WHERE id = $1;', [orderId])
        await client.query('INSERT INTO transactions VALUES ($1, $2, $3, $4, $5);', [
            orderId,
            customerId,
            employeeId,
            0.00,
            orderTimestampRes.rows[0].timestamp
        ]);
        client.release();
        res.status(201).json({ message: "Customer successfully linked to order" });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
});

module.exports = router;