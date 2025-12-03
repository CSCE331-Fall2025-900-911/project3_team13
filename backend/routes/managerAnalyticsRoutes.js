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

module.exports = router;