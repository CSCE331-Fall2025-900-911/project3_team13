const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/', async (req, res) => {
    // query for everything
    try {
        const result = await pool.query('SELECT * FROM menu_items;');

        res.status(200).json({ items: result.rows });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;