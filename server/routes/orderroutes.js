const express = require("express");

const router = express.Router();

const {
    createOrder,
    getOrderById,
    getMyOrders, 
    updateOrder,
    deleteOrder,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/ordercontroller.js");

const {
    protect,
    admin
} = require("../middleware/authmiddleware.js");


// CREATE ORDER
router.post("/", protect, createOrder);


// USER ORDERS
router.get("/myorders",
protect,
getMyOrders);


// ADMIN GET ALL ORDERS
router.get("/",
protect,
admin,
getAllOrders);


// ADMIN UPDATE STATUS
router.put("/:id/status",
protect,
admin,
updateOrderStatus);


// GET SINGLE ORDER
router.get("/:id",
protect,
getOrderById);


// UPDATE ORDER
router.put("/:id",
protect,
updateOrder);


// DELETE ORDER
router.delete("/:id",
protect,
deleteOrder);


module.exports = router;