const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { hasZReportBeenGeneratedToday } = require('../utils/zReportHelper');

// GET /api/get-x-report
router.get('/', async (req, res) => {
    if(await hasZReportBeenGeneratedToday()) {
        return res.status(200).json({
            totalSales: 0.0,
            cancellations: 0,
            usedPoints: 0
        });
    }
    
    const client = await pool.connect();
    try {
        if(await hasZReportBeenGeneratedToday()) {
            console.log("Z-report already generated today, cannot fetch X-report data.");
            return res.status(200).json({
                totalSales: 0.0,
                cancellations: 0,
                usedPoints: 0
            });
        }
        const client = await pool.connect();
        const total_sales_query = "SELECT SUM(total) as total_sales FROM transactions WHERE DATE(timestamp) = CURRENT_DATE;";
        const salesRes = await client.query(total_sales_query);

        const cancellations_query = "SELECT COUNT(*) as cancellation_count FROM orders WHERE DATE(timestamp) = CURRENT_DATE AND status = 'canceled';";
        const cancellationsRes = await client.query(cancellations_query);

        const points_query = `SELECT COUNT(*) AS redeemed_drinks
                                FROM menu_item_order mio
                                JOIN orders o ON mio.orderid = o.id
                                WHERE mio.price_override = 0
                                AND o.timestamp::date = CURRENT_DATE;`;
        const pointsRes = await client.query(points_query);

        res.status(200).json({ 
            totalSales: salesRes.rows[0].total_sales || 0.0,
            cancellations: cancellationsRes.rows[0].cancellation_count || 0,
            usedPoints: pointsRes.rows[0].redeemed_drinks || 0
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        client.release();
    }
});

module.exports = router;