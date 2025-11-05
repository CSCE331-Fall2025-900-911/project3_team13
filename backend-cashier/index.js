const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

const app = express();
const port = 3000;

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DB,
    password: process.env.PSQL_PASS,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});