const express = require('express');
const { getCart, addToCart, removeFromCart } = require("../controllers/cartcontroller.js");
const { protect } = require("../middleware/authmiddleware.js");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.delete("/:id", protect, removeFromCart);

 
module.exports = router;