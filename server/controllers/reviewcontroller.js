const Product = require('../models/product')

//create review

const createReview = async (req,res)=>{
    try{
        const { productId } = req.params;
        const { comment, rating,name } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const alreadyReviewed =
product.reviews.find(

   r =>
   r.user.toString() ===
   req.user._id.toString()
);
if (alreadyReviewed) {

   return res.status(400).json({
      message:
      "Product already reviewed"
   });
}
        const newReview = {
            user: req.user._id,
            comment,
            rating,
            name
        };
        product.reviews.push(newReview);
        product.numReviews += 1;
        await product.save();
        res.status(201).json({ message: "Review created successfully" });
    }
    catch(error){
        res.status(500).json({message: "Server error"})
    }
}


//get product reviews

const getReviews = async (req,res)=>{
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ reviews: product.reviews });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//delete review
const deleteReview = async (req,res)=>{
    try {
        const { productId, reviewId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const reviewIndex = product.reviews.findIndex(review => review._id.toString() === reviewId);
        if (reviewIndex === -1) {
            return res.status(404).json({ message: "Review not found" });
        }
        product.reviews.splice(reviewIndex, 1);
        product.numReviews -= 1;
        await product.save();
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//update review
const updateReview = async (req,res)=>{
    try {
        const { productId, reviewId } = req.params;
        const { comment, rating } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const review = product.reviews.find(review => review._id.toString() === reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        review.comment = comment;
        review.rating = rating;
        await product.save();
        res.status(200).json({ message: "Review updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createReview, getReviews, deleteReview, updateReview }