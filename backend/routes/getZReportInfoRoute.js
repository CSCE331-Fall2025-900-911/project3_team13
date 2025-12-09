const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/auth');
const pool = require('../db/pool');
const { hasZReportBeenGeneratedToday } = require('../utils/zReportHelper');

// GET /api/get-z-report,
router.get('/', async (req, res) => {

    try {
        // Check if Z-report has already been generated today
        const zReportExists = await hasZReportBeenGeneratedToday();
        if (zReportExists) {
            return res.status(409).json({ 
                error: 'Z-report has already been generated for today. No further transactions are allowed.' 
            });
        }

        const client = await pool.connect();

        // total net sales
        const totalSalesQuery = 'SELECT SUM(total) as total_sales FROM transactions WHERE DATE(timestamp) = CURRENT_DATE';
        const totalSalesRes = await client.query(totalSalesQuery);
        const totalSales = totalSalesRes.rows[0].total_sales;
        console.log(totalSales);
        // num transactions
        const numTransactionsQuery = 'SELECT COUNT(id) as transaction_count FROM transactions WHERE DATE(timestamp) = CURRENT_DATE';
        const numTransactionsRes = await client.query(numTransactionsQuery);
        const numTransactions = numTransactionsRes.rows[0].transaction_count;
        console.log(numTransactions);
        // num customers
        const numCustomersQuery = 'SELECT COUNT(DISTINCT customerid) as customer_count FROM transactions WHERE DATE(timestamp) = CURRENT_DATE';
        const numCustomersRes = await client.query(numCustomersQuery);
        const numCustomers = numCustomersRes.rows[0].customer_count;
        console.log(numCustomers);
        // add date to z report table
        const addZReportQuery = 'INSERT INTO z_reports (gen_time) VALUES (to_timestamp($1/1000.0));';
        await client.query(addZReportQuery, [Date.now()]);

        client.release();

        // note that once z report is generated, no more transactions can take place for the remainder of the day
        res.status(200).json({ 
            totalSales: totalSales || 0.0,
            numTransactions: numTransactions || 0,
            numCustomers: numCustomers || 0
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;