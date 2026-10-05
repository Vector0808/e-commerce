const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistcontroller');
const { protect } = require('../middleware/authmiddleware');

router.get('/', protect, getWishlist);
router.post('/add', protect, addToWishlist);
router.delete('/remove', protect, removeFromWishlist);

module.exports = router;