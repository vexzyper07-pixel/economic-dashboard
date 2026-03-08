 const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const productController = require("../controllers/productController");
//for new get data
router.get("/products", productController.getProducts);
// for poat data
router.post(
 "/products",
 upload.single("image"),
 productController.createProduct
);
//for put 
router.put(
 "/products/:id",
 upload.single("image"),
 productController.updateProduct
);
//for delete
router.delete(
 "/products/:id",
 productController.deleteProduct
);

module.exports = router;