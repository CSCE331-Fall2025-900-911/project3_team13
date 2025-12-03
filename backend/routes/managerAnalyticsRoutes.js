const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /orders-per-item-today
router.get('/orders-per-item-today', async (req, res) => {
    try {
        const query = `
            SELECT 
                mi.name AS item_name,
                COUNT(CASE WHEN (o.timestamp AT TIME ZONE 'UTC')::date = CURRENT_DATE THEN 1 END) AS count
            FROM menu_items mi
            LEFT JOIN menu_item_order moi ON mi.id = moi.menuitemid
            LEFT JOIN orders o ON moi.orderid = o.id
            GROUP BY mi.name
            ORDER BY count DESC;
        `;

        const result = await pool.query(query);

        res.status(200).json({
            message: "Today's order counts returned",
            ordersPerItem: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET /hourly-sales-today
router.get('/hourly-sales-today', async (req, res) => {
    try {
        const query = `
            WITH hours AS (
                SELECT generate_series(0, 23) AS hour
            ),
            orders_today AS (
                SELECT EXTRACT(HOUR FROM timestamp AT TIME ZONE 'UTC') AS hour
                FROM orders
                WHERE (timestamp AT TIME ZONE 'UTC')::date = CURRENT_DATE
            )
            SELECT 
                h.hour,
                COALESCE(COUNT(o.hour), 0) AS order_count
            FROM hours h
            LEFT JOIN orders_today o ON o.hour = h.hour
            GROUP BY h.hour
            ORDER BY h.hour;
        `;

        const result = await pool.query(query);

        const formatted = result.rows.map(row => ({
            name: `${row.hour}:00`,
            value: Number(row.order_count)
        }));

        res.status(200).json({ hourlySales: formatted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET /manager-analytics/trends?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&itemName=optional
router.get('/trends', async (req, res) => {
    try {
        const { startDate, endDate, itemName } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "startDate and endDate are required" });
        }

        const params = [startDate, endDate];
        let itemFilter = '';
        if (itemName) {
            params.push(itemName);
            itemFilter = `AND mi.name = $3`;
        }

        const query = `
            SELECT 
                TO_CHAR(o.timestamp::date, 'YYYY-MM-DD') AS name,
                COUNT(*) AS value
            FROM orders o
            JOIN menu_item_order moi ON o.id = moi.orderid
            JOIN menu_items mi ON moi.menuitemid = mi.id
            WHERE o.timestamp::date BETWEEN $1 AND $2
            ${itemFilter}
            GROUP BY o.timestamp::date
            ORDER BY o.timestamp::date;
        `;

        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET /manager-analytics/transactions?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/transactions', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "startDate and endDate are required" });
        }

        const query = `
            SELECT 
                TO_CHAR(o.timestamp::date, 'YYYY-MM-DD') AS name,
                SUM(mi.price) AS value
            FROM orders o
            JOIN menu_item_order moi ON o.id = moi.orderid
            JOIN menu_items mi ON moi.menuitemid = mi.id
            WHERE o.timestamp::date BETWEEN $1 AND $2
            GROUP BY o.timestamp::date
            ORDER BY o.timestamp::date;
        `;

        const result = await pool.query(query, [startDate, endDate]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;