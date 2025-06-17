const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all disasters
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM disasters ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch disasters' });
  }
});

// POST new disaster
router.post('/', async (req, res) => {
  const { title, location_name, description, tags, owner_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO disasters (title, location_name, description, tags, owner_id, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [title, location_name, description, tags, owner_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Failed to create disaster' });
  }
});

// ✅ PUT (update disaster)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, location_name, description } = req.body;

  try {
    const result = await pool.query(
      `UPDATE disasters
       SET title = $1, location_name = $2, description = $3
       WHERE id = $4
       RETURNING *`,
      [title, location_name, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Disaster not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update disaster' });
  }
});

// ✅ DELETE (delete disaster)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM disasters WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Disaster not found' });
    }

    res.json({ message: 'Disaster deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete disaster' });
  }
});

module.exports = router;
