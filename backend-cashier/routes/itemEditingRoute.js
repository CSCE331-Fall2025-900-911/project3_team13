// routes/itemEditingRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db/pool');


router.post('/', async (req, res) => {
    const { comboid, itemid, oldprice, newprice, editreason } = req.body;
});


module.exports = router;
