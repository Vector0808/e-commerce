const express = require('express');
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct } = require("../controllers/productcontroller.js");
const { protect, admin } = require("../middleware/authmiddleware.js");

const router = express.Router();
router.get("/", getProducts)
router.post("/", protect, admin, createProduct);
router.get("/:id", getProductById);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

 
module.exports = router;