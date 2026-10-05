const express = require('express');
const router = express.Router();
const { createReview, getReviews, deleteReview,updateReview } = require('../controllers/reviewcontroller');
const { protect } = require('../middleware/authmiddleware');

//post
router.post('/products/:productId/reviews', protect, createReview);

//get
router.get('/products/:productId/reviews', getReviews);

//delete
router.delete('/products/:productId/reviews/:reviewId', protect, deleteReview);

//put
router.put('/products/:productId/reviews/:reviewId', protect, updateReview);

module.exports = router;