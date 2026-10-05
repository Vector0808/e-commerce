const crypto = require("crypto");

const Order = require("../models/orders");

const instance = require("../config/razorpay");


// CREATE PAYMENT ORDER

const createPayment = async (req, res) => {

    try {

        const { orderId } = req.body;

        // FIND ORDER

        const foundOrder = await Order.findById(
            orderId
        );

        if (!foundOrder) {

            return res.status(404).json({
                message: "Order not found"
            });
        }

        // CHECK IF ALREADY PAID

        if (foundOrder.isPaid) {

            return res.status(400).json({
                message: "Order already paid"
            });
        }

        // CREATE RAZORPAY ORDER

        const options = {

            amount:
                foundOrder.totalPrice * 100,

            currency: "INR",

            receipt:
                `receipt_${foundOrder._id}`
        };

        const razorpayOrder =
            await instance.orders.create(options);

        res.status(200).json({

            success: true,

            razorpayOrder,

            key:
                process.env.RAZORPAY_KEY_ID

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to create payment"
        });
    }
};


// VERIFY PAYMENT

const verifyPayment = async (req, res) => {

    try {

        const {

            orderId,

            razorpay_order_id,

            razorpay_payment_id,

            razorpay_signature

        } = req.body;


        // GENERATE SIGNATURE

        const generatedSignature =
            crypto

            .createHmac(
                "sha256",
                process.env.RAZORPAY_SECRET
            )

            .update(
                razorpay_order_id +
                "|" +
                razorpay_payment_id
            )

            .digest("hex");


        // VERIFY SIGNATURE

        if (
            generatedSignature !==
            razorpay_signature
        ) {

            return res.status(400).json({
                message:
                "Invalid payment signature"
            });
        }


        // FIND ORDER

        const foundOrder =
            await Order.findById(orderId);

        if (!foundOrder) {

            return res.status(404).json({
                message: "Order not found"
            });
        }


        // UPDATE ORDER

        foundOrder.isPaid = true;

        foundOrder.paidAt = Date.now();

        foundOrder.paymentResult = {

            id: razorpay_payment_id,

            status: "Paid",

            update_time:
                new Date().toISOString(),

            email_address:
                req.user.email
        };


        // SAVE ORDER

        await foundOrder.save();


        res.status(200).json({

            success: true,

            message:
                "Payment verified successfully",

            order: foundOrder
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message:
            "Failed to verify payment"
        });
    }
};


module.exports = {

    createPayment,

    verifyPayment
};