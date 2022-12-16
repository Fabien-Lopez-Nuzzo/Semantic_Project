const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/info", async (req, res) => {
  try {
    const info = await axios.get(
      "https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels&ids=" +
        req.body.ids +
        "&languages=en&format=json"
    );
    res.status(201).json({ data: info?.data });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

module.exports = router;
