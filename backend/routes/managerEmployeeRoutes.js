const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// ------------------------------------------------------------
// GET ALL EMPLOYEES (from users table, not employees table)
// ------------------------------------------------------------
router.get('/get-all-employees', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, username, email, role 
             FROM users 
             ORDER BY id ASC;`
        );

        res.status(200).json({ employees: result.rows });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ------------------------------------------------------------
// ADD EMPLOYEE (local account)
// body: { name }
// ------------------------------------------------------------
router.post('/add-employee', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Missing name' });
    }

    try {
        const username = name.toLowerCase().replace(/\s+/g, "_");
        const password = Math.random().toString(36).slice(-6);

        const result = await pool.query(
            `INSERT INTO users (name, username, password, role, auth_method)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, username, email, role`,
            [name, username, password, "pending", "local"]
        );

        res.status(201).json({
            message: "Employee added",
            employee: result.rows[0],
            password  // return temporary password
        });

    } catch (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ------------------------------------------------------------
// DELETE EMPLOYEE
// ------------------------------------------------------------
router.delete('/delete-employee', async (req, res) => {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id parameter' });

    try {
        const result = await pool.query(
            `DELETE FROM users WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ error: "Employee not found" });

        res.status(200).json({ message: "Employee deleted", id: result.rows[0].id });
    } catch (err) {
        console.error("Error deleting employee:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ------------------------------------------------------------
// UPDATE EMPLOYEE
// Only editable fields: name, username, email, role
// ------------------------------------------------------------
router.patch('/update-employee', async (req, res) => {
    const { id, field, value } = req.body;

    const allowedFields = ["name", "username", "email", "role", "password"];

    if (!id || !allowedFields.includes(field)) {
        return res.status(400).json({ error: "Invalid id or field" });
    }

    try {
        const updateRes = await pool.query(
            `UPDATE users SET ${field} = $1 WHERE id = $2 
             RETURNING id, name, username, email, role`,
            [value, id]
        );

        if (updateRes.rowCount === 0)
            return res.status(404).json({ error: "Employee not found" });

        res.status(200).json({
            message: "Employee updated",
            employee: updateRes.rows[0]
        });

    } catch (err) {
        console.error("Error updating employee:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
