const express = require("express")

const router = express.Router();

const {
    createPayment,
    verifyPayment
} = require("../controllers/paymentcontroller.js");

router.post("/createorder" , createPayment);
router.post("/verifypayment" , verifyPayment);


module.exports = router;
