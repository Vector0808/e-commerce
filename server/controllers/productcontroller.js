const Product = require("../models/product.js");


// GET ALL PRODUCTS

const getProducts = async (req,res) => {

    try {

        const products = await Product.find({});

        res.json(products);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};


// GET SINGLE PRODUCT

const getProductById = async (req,res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};


// CREATE PRODUCT

const createProduct = async (req,res) => {

    try {

        const {
            name,
            description,
            price,
            category,
            image,
            stock,
            brand
        } = req.body;

        const createdProduct = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock,
            brand
        });

        res.status(201).json(createdProduct);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE PRODUCT

const updateProduct = async (req,res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.category = req.body.category || product.category;
        product.image = req.body.image || product.image;
        product.stock = req.body.stock || product.stock;
        product.brand = req.body.brand || product.brand;

        const updatedProduct = await product.save();

        res.json(updatedProduct);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE PRODUCT

const deleteProduct = async (req,res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await product.deleteOne();

        res.json({
            message: "Product deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};