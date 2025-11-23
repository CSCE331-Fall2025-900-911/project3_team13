const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/', async (req, res) => {
    // get order (status 205 means that there is nothing to return, this is just a placeholder)
    res.status(205);
});

module.exports = router;