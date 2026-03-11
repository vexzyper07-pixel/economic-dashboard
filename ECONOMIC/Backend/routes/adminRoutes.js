const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  login,
  addProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/adminController");

router.post("/login", login);
router.post("/products", auth, admin, addProduct);
router.put("/products/:id", auth, admin, updateProduct);
router.delete("/products/:id", auth, admin, deleteProduct);

module.exports = router;
