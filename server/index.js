require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'db',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432
});

async function initTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS counters (
        id SERIAL PRIMARY KEY,
        value INTEGER NOT NULL
        );
    `);
    const { rows } = await pool.query('SELECT * FROM counters LIMIT 1;');
    if (rows.length === 0) {
        await pool.query('INSERT INTO counters (value) VALUES ($1);', [0]);
    }
}
initTable().catch(console.error);

app.get('/counter', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT value FROM counters LIMIT 1;');
        const currentValue = rows[0].value;
        res.json({ value: currentValue });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error reading counter');
    }
});

app.post('/counter', async (req, res) => {
    try {
        await pool.query('UPDATE counters SET value = value + 1 WHERE id=1;');
        const { rows } = await pool.query('SELECT value FROM counters LIMIT 1;');
        res.json({ value: rows[0].value });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating counter');
    }
});

const port = process.env.PORT || 5000;
    app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
