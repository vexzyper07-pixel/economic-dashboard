const router = require("express").Router();
const { checkout } = require("../controllers/orderController");

router.post("/checkout", checkout);

module.exports = router;