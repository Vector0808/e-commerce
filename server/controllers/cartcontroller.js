const Cart = require("../models/cart.js");

//get cart

const getCart = async (req,res)=>{
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate("products.productId");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.json(cart);
        
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

//add to cart

const addToCart = async (req,res)=>{
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.user._id });   
        if (!cart) {
            cart = new Cart({
                userId: req.user._id,
                products: [{ productId, quantity }],
            });
        } else {
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex >= 0) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
        }
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

//remove from cart
const removeFromCart = async (req,res)=>{
    try {
        const { id } = req.params;
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.products = cart.products.filter(p => p.productId.toString() !== id);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { getCart, addToCart, removeFromCart }