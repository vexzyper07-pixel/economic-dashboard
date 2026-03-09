const router = require("express").Router();
 const pool = require("../config/db");
router.post("/payment", async (req, res) => {

  try {

    await pool.query(
      "UPDATE cart SET action='done' WHERE action='pending'"
    );

    res.json({ success: true });

  } catch (error) {

    console.log(error);

    res.status(500).json({ success: false });

  }

});

module.exports = router;