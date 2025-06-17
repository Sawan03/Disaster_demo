// backend/routes/socialMedia.js
const express = require("express");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.json([
    { post: "#flood Need rescue boats in Queens!", user: "citizen1" },
    { post: "#earthquake Trapped in building", user: "citizen2" },
  ]);
});

module.exports = router;
