// backend/routes/resources.js
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

router.get("/", async (req, res) => {
  const { lat, lon } = req.query;
  const { data, error } = await supabase.rpc("nearby_resources", {
    lat: parseFloat(lat),
    lon: parseFloat(lon),
  });
  res.json({ data, error });
});

module.exports = router;
