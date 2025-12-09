const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET /api/login/cashier
router.post('/cashier', async (req, res) => {
    const { username, password } = req.body;
    try {
        const employeeRes = await pool.query(
            `SELECT id, name, username, permissions 
             FROM employees 
             WHERE username = $1 AND password = $2`,
            [username, password]
        );

        if (employeeRes.rows.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        
        const employee = employeeRes.rows[0];
        if(employee.permissions !== 0) {
            return res.status(403).json({ message: "Access denied: Not a cashier" });
        }
        res.status(200).json({ message: "Login successful", employee });
    } catch (error) {
        console.error("Error during cashier login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET /api/login/manager
router.post('/manager', async (req, res) => {
    const { username, password } = req.body;
    try {
        const employeeRes = await pool.query(
            `SELECT id, name, username, permissions 
             FROM employees 
             WHERE username = $1 AND password = $2`,
            [username, password]
        );

        if (employeeRes.rows.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        
        const employee = employeeRes.rows[0];
        if(employee.permissions !== 1) {
            return res.status(403).json({ message: "Access denied: Not a manager" });
        }
        res.status(200).json({ message: "Login successful", employee });
    } catch (error) {
        console.error("Error during manager login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;