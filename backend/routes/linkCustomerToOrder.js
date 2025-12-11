const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.post('/', async (req, res) => {
    const { orderId, customerName, customerPhone, employeeId } = req.body;

    const client = await pool.connect();
    try {
        // find customer
        const findCustomer = await client.query('SELECT * FROM customers WHERE name = $1 AND phone = $2;', [
            customerName,
            customerPhone
        ]);

        let customerId = null;
        if(findCustomer.rows.length == 0) {
            // insert new customer
            const insertRes = await client.query('INSERT INTO customers (name, phone) VALUES ($1, $2) RETURNING id;', [
                customerName,
                customerPhone
            ]);
            customerId = insertRes.rows[0].id;
        } else {
            customerId = findCustomer.rows[0].id;
        }
        
        // get order timestamp
        const orderTimestampRes = await client.query('SELECT timestamp FROM orders WHERE id = $1;', [orderId])
        await client.query('INSERT INTO transactions VALUES ($1, $2, $3, $4, $5);', [
            orderId,
            customerId,
            employeeId,
            0.00,
            orderTimestampRes.rows[0].timestamp
        ]);

        res.status(201).json({ message: "Customer successfully linked to order" });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        client.release();
    }
});

module.exports = router;