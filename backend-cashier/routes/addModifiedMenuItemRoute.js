const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// add modified menu item to order
router.post('/', async (req, res) => {
    // requests to this route should contain order ID, menu item ID, and a list of modifications
    // ideally the modifications should be of the form [{itemName: "item name", quantity: x}, ...]
    const { orderId, menuItemId, modifications } = req.body;
    
    try {
        const client = await pool.connect();
        const lastMenuItemOrderRes = await client.query('SELECT MAX(id) FROM menu_item_order;');
        const menuItemOrderId = (lastMenuItemOrderRes.rows[0].max || 0) + 1;
        await client.query('INSERT INTO menu_item_order (id, menuitemid, orderid) VALUES ($1, $2, $3);', [
            menuItemOrderId,
            menuItemId,
            orderId
        ]);

        // how is quantity represented?
        for(const mod of modifications) {
            let { itemName, quantity } = mod;
            console.log(itemName, quantity);
            const invItemRes = await client.query('SELECT id from inventory WHERE name = $1;', [itemName]);
            console.log(invItemRes.rows.length);
            if(invItemRes.rows.length > 0) {
                const invItemId = invItemRes.rows[0].id;

                await client.query('INSERT INTO item_editing_table (comboid, inventoryid, quantity) VALUES ($1, $2, $3);', [
                    menuItemOrderId,
                    invItemId,
                    quantity
                ]);
            }
        }
        client.release();
        res.status(201).json({ message: 'Item added to order successfully' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})
module.exports = router;