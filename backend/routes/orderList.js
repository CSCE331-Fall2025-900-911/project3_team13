const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.get("/", async (req, res) => {
    console.log("Loaded: orderList route");

    try {
        // Fetch orders EXCEPT completed & canceled
        const orderResults = await pool.query(
            `SELECT 
                o.id, 
                o.status, 
                o.timestamp, 
                c.name AS customer_name
             FROM orders o
             LEFT JOIN transactions t ON o.id = t.id
            LEFT JOIN customers c ON t.customerid = c.id
             WHERE o.status NOT IN ('completed', 'canceled')
             ORDER BY o.timestamp DESC`
        );

        const orders = orderResults.rows;

        // Attach drink items + modifications
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
        console.error("Error in order-list:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
