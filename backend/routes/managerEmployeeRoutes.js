const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/employees/get-all-employees
router.get('/get-all-employees', async (req, res) => {
	try {
		const client = await pool.connect();
		const employeesRes = await client.query('SELECT id, name, username, permissions FROM employees ORDER BY id ASC;');
		res.status(200).json({ employees: employeesRes.rows });
	} catch (err) {
		console.error('Error fetching employees:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// POST /api/employees/add-employee (body: { name, permissions })
router.post('/add-employee', async (req, res) => {
	const { name, permissions } = req.body;
	if (!name || (permissions !== 0 && permissions !== 1)) {
		return res.status(400).json({ error: 'Missing or invalid name/permissions' });
	}

	try {
		const client = await pool.connect();

		const username = name.toLowerCase().replace(" ", "_");
		const password = Math.random().toString(36).slice(-6);

		const insertRes = await client.query(
			'INSERT INTO employees (name, username, password, permissions) VALUES ($1, $2, $3, $4) RETURNING id, username;', 
			[name, username, password, permissions]
		);
		res.status(201).json({ message: 'Employee added', employee: insertRes.rows[0], password });
	} catch (err) {
		console.error('Error adding employee:', err);
		res.status(500).json({ error: 'Internal server error' });
	}

});

// DELETE /api/employees/delete-employee?id=<employee id>
router.delete('/delete-employee', async (req, res) => {
	const { id } = req.query;
	if (!id) return res.status(400).json({ error: 'Missing id parameter' });

	try {
		const client = await pool.connect();
		const deleteRes = await client.query('DELETE FROM employees WHERE id = $1 RETURNING id;', [id]);
		if (deleteRes.rowCount === 0) return res.status(404).json({ error: 'Employee not found' });
		res.status(200).json({ message: 'Employee deleted', id: deleteRes.rows[0].id });
	} catch (err) {
		console.error('Error deleting employee:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// PATCH /api/employees/promote-employee?id=<employee id>
router.patch('/promote-employee', async (req, res) => {
	const { id } = req.query;
	if (!id) return res.status(400).json({ error: 'Missing id parameter' });

	try {
		const client = await pool.connect();
		const updateRes = await client.query('UPDATE employees SET permissions = 1 WHERE id = $1 RETURNING id, name, permissions;', [id]);
		if (updateRes.rowCount === 0) return res.status(404).json({ error: 'Employee not found' });
		res.status(200).json({ message: 'Employee promoted', employee: updateRes.rows[0] });
	} catch (err) {
		console.error('Error promoting employee:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;