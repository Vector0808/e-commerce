const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserdata } = require("../controllers/authcontroller.js");
const { protect, admin } = require("../middleware/authmiddleware.js");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/users" ,protect, admin, getUserdata);

 
module.exports = router;  