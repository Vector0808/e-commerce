const Wishlist = require('../models/wishlist');
const Product = require('../models/product');

// GET WISHLIST

const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist not found"
            });
        }
        res.json(wishlist);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] });
        }
        if (wishlist.products.includes(productId)) {
            return res.status(400).json({
                message: "Product already in wishlist"
            });
        }
        wishlist.products.push(productId);
        await wishlist.save();
        res.json(wishlist);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// REMOVE FROM WISHLIST 

const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist not found"
            });
        }
        if (!wishlist.products.includes(productId)) {
            return res.status(400).json({
                message: "Product not in wishlist"
            });
        }
        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        await wishlist.save();
        res.json(wishlist);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};