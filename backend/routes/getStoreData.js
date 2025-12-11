const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/', async (req, res) => {
    try {
        const inventoryQuery = await pool.query("SELECT id, name, quantity FROM inventory ORDER BY id;");
        const menuQuery = await pool.query("SELECT id, name, category, price FROM menu_items ORDER BY id;");
        const employeeQuery = await pool.query("SELECT id, name, username, email, role, password FROM users ORDER BY id;");
        
        const [inventoryResult, menuResult, employeeResult] = await Promise.all([
            inventoryQuery, menuQuery, employeeQuery
        ]);

        res.status(200).json({
            inventory: inventoryResult.rows,
            menu: menuResult.rows,
            employees: employeeResult.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;