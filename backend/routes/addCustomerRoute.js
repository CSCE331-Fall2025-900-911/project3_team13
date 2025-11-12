const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// add customer to order
router.post('/', async (req, res) => {
    // requests to this route should contain order ID, customer name, employee ID, and customer phone number.
    const { customerName, customerPhone } = req.body;
    
    try {
        const client = await pool.connect();

        const findCustomer = await client.query('SELECT * FROM customers WHERE name = $1 AND phone = $2;', [
            customerName,
            customerPhone
        ]);

        let customerId = null;
        if(findCustomer.rows.length == 0) {
            const insertRes = await client.query('INSERT INTO customers (name, phone) VALUES ($1, $2) RETURNING id;', [
                customerName,
                customerPhone
            ]);
            customerId = insertRes.rows[0].id;
        } else {
            customerId = findCustomer.rows[0].id;
        }

        client.release();
        res.status(201).json({ message: 'Customer added to order successfully', customerId: customerId });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;