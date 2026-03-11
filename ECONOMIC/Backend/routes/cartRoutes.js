const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem
} = require("../controllers/cartController");

router.use(auth);

router.get("/", getCart);
router.post("/", addToCart);
router.patch("/:id", updateCartItem);
router.delete("/:id", removeCartItem);

module.exports = router;
