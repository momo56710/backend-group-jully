const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("../controllers/productController");
const verifyToken = require("../middleware/verifyToken");
router.get("/", getAllProducts);
router.post("/", verifyToken, createProduct);
router.get("/my-products", verifyToken, getMyProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
