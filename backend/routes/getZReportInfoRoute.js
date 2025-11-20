const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/', async (req, res) => {
    try {
        const client = await pool.connect();

        // total net sales
        const totalSalesQuery = 'SELECT SUM(total) as total_sales FROM transactions WHERE DATE(timestamp) = CURRENT_DATE';
        const totalSalesRes = await client.query(totalSalesQuery);
        const totalSales = totalSalesRes.rows[0].total_sales;

        // num transactions
        const numTransactionsQuery = 'SELECT COUNT(id) as transaction_count FROM transactions WHERE DATE(timestamp) = CURRENT_DATE';
        const numTransactionsRes = await client.query(numTransactionsQuery);
        const numTransactions = numTransactionsRes.rows[0].transaction_count;

        // num customers
        const numCustomersQuery = 'SELECT COUNT(DISTINCT customerid) as customer_count FROM transactions WHERE DATE(timestamp) = CURRENT_DATE';
        const numCustomersRes = await client.query(numCustomersQuery);
        const numCustomers = numCustomersRes.rows[0].customer_count;

        // add date to z report table
        const addZReportQuery = 'INSERT INTO z_reports (gen_time) VALUES (to_timestamp($1/1000.0));';
        await client.query(addZReportQuery, [Date.now()]);

        // note that once z report is generated, no more transactions can take place for the remainder of the day
        res.status(200).json({ 
            total_sales: totalSales === null ? 0.0 : parseFloat(totalSales),
            num_transactions: numTransactions === null ? 0 : parseInt(numTransactions),
            num_customers: numCustomers === null ? 0 : parseInt(numCustomers)
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;