const Order = require("../models/orders");
const Cart = require("../models/cart");


// CREATE ORDER

const createOrder = async (req, res) => {

    try {

        const {
            shippingAddress,
            paymentMethod
        } = req.body;

        // FIND USER CART

        const userCart = await Cart.findOne({
            userId: req.user._id
        }).populate("products.productId");

        // CHECK CART

        if (!userCart || userCart.products.length === 0) {

            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        // CREATE ORDER ITEMS

        const orderItems = userCart.products.map(item => ({

            name: item.productId.name,

            quantity: item.quantity,

            image: item.productId.image,

            price: item.productId.price,

            product: item.productId._id

        }));


        // CALCULATE PRICES

        const itemsPrice = orderItems.reduce(

            (acc, item) =>

                acc + item.price * item.quantity,

            0
        );

        const taxPrice = itemsPrice * 0.1;

        const shippingPrice = itemsPrice > 500 ? 0 : 50;

        const totalPrice =
            itemsPrice +
            taxPrice +
            shippingPrice;


        // CREATE ORDER

        const newOrder = await Order.create({

            user: req.user._id,

            orderItems,

            shippingAddress,

            paymentMethod,

            taxPrice,

            shippingPrice,

            totalPrice

        });


        // CLEAR CART AFTER ORDER

        userCart.products = [];

        await userCart.save();


        res.status(201).json(newOrder);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// GET ORDER BY ID

const getOrderById = async (req, res) => {

    try {

        const foundOrder = await Order.findById(
            req.params.id
        )
        .populate("user", "name email");

        if (!foundOrder) {

            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json(foundOrder);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// GET MY ORDERS

const getMyOrders = async (req, res) => {

    try {

        const myOrders = await Order.find({

            user: req.user._id

        }).sort({

            createdAt: -1

        });

        res.json(myOrders);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// UPDATE ORDER

const updateOrder = async (req, res) => {

    try {

        const foundOrder = await Order.findById(
            req.params.id
        );

        if (!foundOrder) {

            return res.status(404).json({
                message: "Order not found"
            });
        }

        foundOrder.shippingAddress =
            req.body.shippingAddress ||
            foundOrder.shippingAddress;

        foundOrder.paymentMethod =
            req.body.paymentMethod ||
            foundOrder.paymentMethod;

        const updatedOrder =
            await foundOrder.save();

        res.json(updatedOrder);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// DELETE ORDER

const deleteOrder = async (req, res) => {

    try {

        const foundOrder = await Order.findById(
            req.params.id
        );

        if (!foundOrder) {

            return res.status(404).json({
                message: "Order not found"
            });
        }

        await foundOrder.deleteOne();

        res.json({
            message: "Order deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// GET ALL ORDERS (ADMIN)

const getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find({})
        .populate("user", "name email")
        .sort({
            createdAt: -1
        });

        res.json(orders);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// UPDATE ORDER STATUS

const updateOrderStatus = async (req, res) => {

    try {

        const foundOrder = await Order.findById(
            req.params.id
        );

        if (!foundOrder) {

            return res.status(404).json({
                message: "Order not found"
            });
        }

        foundOrder.status =
            req.body.status;

        // DELIVERED

        if (req.body.status === "Delivered") {

            foundOrder.isDelivered = true;

            foundOrder.deliveredAt =
                Date.now();
        }

        // PAID

        if (req.body.status === "Paid") {

            foundOrder.isPaid = true;

            foundOrder.paidAt =
                Date.now();
        }

        const updatedOrder =
            await foundOrder.save();

        res.json(updatedOrder);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {

    createOrder,

    getOrderById,

    getMyOrders,

    updateOrder,

    deleteOrder,

    getAllOrders,

    updateOrderStatus
};