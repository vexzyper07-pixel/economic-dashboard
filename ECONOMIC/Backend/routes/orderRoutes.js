const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { checkout, getOrders } = require("../controllers/orderController");

router.get("/", auth, getOrders);
router.post("/checkout", auth, checkout);

module.exports = router;
