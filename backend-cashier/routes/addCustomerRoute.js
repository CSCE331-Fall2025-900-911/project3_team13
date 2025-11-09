const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// add customer to order
router.post('/', async (req, res) => {
    const { orderId, customerName, employeeId, customerPhone } = req.body;
    
    try {
        const client = await pool.connect();

        const findCustomer = await client.query('SELECT * FROM customers WHERE name = $1 AND phone = $2;', [
            customerName,
            customerPhone
        ]);

        let customerId = null;
        if(findCustomer.rows.length == 0) {
            const lastCustomerIdRes = await client.query('SELECT MAX(id) FROM customers;');
            customerId = (lastCustomerIdRes.rows[0].max || 0) + 1;
            await client.query('INSERT INTO customers (id, name, phone) VALUES ($1, $2, $3) RETURNING id;', [
                customerId,
                customerName,
                customerPhone
            ]);
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
        client.release();
        res.status(201).json({ message: 'Customer added to order successfully' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;