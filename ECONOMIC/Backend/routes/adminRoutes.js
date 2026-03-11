const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  addProduct,
  updateProduct,
  deleteProduct,
  getUsers
} = require("../controllers/adminController");

router.post("/products", auth, admin, addProduct);
router.put("/products/:id", auth, admin, updateProduct);
router.delete("/products/:id", auth, admin, deleteProduct);
router.get("/users", auth, admin, getUsers);

module.exports = router;