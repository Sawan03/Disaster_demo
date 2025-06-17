// backend/routes/verifyImage.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/verify-image/:id
router.post('/:id', async (req, res) => {
  const { image_url } = req.body;
  const { id } = req.params;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!image_url) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const prompt = `Analyze image at ${image_url} for signs of manipulation or disaster context.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const result = response.data;
    res.status(200).json({ message: 'Image verified', result });
  } catch (error) {
    console.error('Gemini API error:', error.message);
    res.status(500).json({ error: 'Image verification failed' });
  }
});

module.exports = router;
