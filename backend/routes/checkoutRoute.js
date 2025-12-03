const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.patch('/', async (req, res) => {
    // get total price of all the items
    const { orderId, total, status } = req.body;
    try {
        const client = await pool.connect();
        const updateTransactionsRes = await client.query('UPDATE transactions SET total = $1 WHERE id = $2 RETURNING id', [
            total,
            orderId
        ]);

        if(updateTransactionsRes.rows.length === 0) {
            return res.status(404).json({ message: "Transaction for order not found--likely no customer was linked to the order."});
        }

        const updateOrdersRes = await client.query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING timestamp", [status, orderId]);
        res.status(200).json({ message: "Checkout successful", orderInfo: {
            orderId: orderId,
            total: total,
            timestamp: updateOrdersRes.rows[0].timestamp
        }});
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;