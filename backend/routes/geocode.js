// backend/routes/geocode.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { description } = req.body;

  // 1. Extract location with Gemini
  const geminiPrompt = `Extract location from: ${description}`;
  const geminiRes = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
    contents: [{ parts: [{ text: geminiPrompt }] }],
  }, {
    params: { key: process.env.GEMINI_API_KEY },
  });

  const locationName = geminiRes.data.candidates[0]?.content?.parts[0]?.text;

  // 2. Geocode to lat/lng
  const geoRes = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
    params: {
      address: locationName,
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });

  const coordinates = geoRes.data.results[0]?.geometry?.location;

  res.json({ locationName, coordinates });
});

module.exports = router;
