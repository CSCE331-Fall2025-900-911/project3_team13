const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET /api/order-list?status=completed
router.get("/", async (req, res) => {
    const { status } = req.query;

    const allowed = [
        "pending", 
        "completed", 
        "canceled",
        "in progress",
        "ready to pay"
    ];

    if (!status) {
        return res.status(400).json({ error: "Missing status parameter" });
    }
    if (!allowed.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    try {
        //Get orders with this status + customer name
        const orderResults = await pool.query(
            `SELECT o.id, o.status, o.timestamp, 
                    c.name AS customer_name
             FROM orders o
             JOIN transactions t ON o.id = t.id
             JOIN customers c ON t.customerid = c.id
             WHERE o.status = $1
             ORDER BY o.timestamp DESC`,
            [status]
        );

        const orders = orderResults.rows;

        //For every order, fetch menu items + modifications
        for (const order of orders) {

            const itemsResult = await pool.query(
                `SELECT 
                    mio.id AS combo_id,
                    mio.menuitemid,
                    mi.name AS menu_item_name,
                    iet.sugar,
                    iet.ice,
                    iet.size,
                    iet.shots,
                    iet.notes
                FROM menu_item_order mio
                JOIN menu_items mi ON mio.menuitemid = mi.id
                LEFT JOIN item_editing_table iet ON mio.id = iet.comboid
                WHERE mio.orderid = $1`,
                [order.id]
            );

            // Format items
            order.items = itemsResult.rows.map(item => ({
                comboId: item.combo_id,
                menuItemId: item.menuitemid,
                menuItemName: item.menu_item_name,
                modifications: {
                    Sugar: item.sugar,
                    Ice: item.ice,
                    Size: item.size,
                    Shots: item.shots,
                    Notes: item.notes
                }
            }));
        }

        res.json({ orders });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
