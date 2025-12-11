const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/load-order
router.get('/', async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: "Missing ID parameter" });
    }

    const client = await pool.connect();
    try {
        const menuItemsRes = await client.query(
            `SELECT 
                mio.id AS comboid,
                mi.id AS menuitemid,
                mi.name,
                CAST(mi.price AS FLOAT) AS price,
                iet.sugar,
                iet.ice,
                iet.size,
                iet.shots,
                iet.notes
             FROM menu_item_order mio
             JOIN menu_items mi ON mio.menuitemid = mi.id
             LEFT JOIN item_editing_table iet ON mio.id = iet.comboid
             WHERE mio.orderid = $1;`,
             [id]
        );

        const items = menuItemsRes.rows;

        res.json({ items });
    } catch (error) {
        console.error('Error loading order:', error);
        res.status(500).json({ error: 'Failed to load order' });
    } finally {
        client.release();
    }
});

module.exports = router;


/**
 * item_editing_table schema
 *  Column  |         Type          | Collation | Nullable | Default 
---------+-----------------------+-----------+----------+---------
 comboid | integer               |           | not null | 
 sugar   | character varying(50) |           | not null | 
 ice     | character varying(50) |           | not null | 
 size    | character varying(50) |           | not null | 
 shots   | character varying(50) |           | not null | 
 notes   | text                  |           |          | 
Indexes:
    "item_editing_table_pkey" PRIMARY KEY, btree (comboid)
Foreign-key constraints:
    "item_editing_table_comboid_fkey" FOREIGN KEY (comboid) REFERENCES menu_item_order(id) ON DELETE CASCADE
 */