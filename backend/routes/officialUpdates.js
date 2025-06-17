// backend/routes/officialUpdates.js
const express = require('express');
const router = express.Router();

// Dummy GET route for official updates
router.get('/', async (req, res) => {
  res.status(200).json([
    {
      id: 1,
      message: "Heavy rainfall expected in coastal areas.",
      timestamp: new Date()
    },
    {
      id: 2,
      message: "Evacuation notice for low-lying flood zones.",
      timestamp: new Date()
    }
  ]);
});

module.exports = router;
