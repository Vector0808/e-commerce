const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
   
    brand:{
        type: String,
    },
  reviews: [
   {
      user: {
         type:
         mongoose.Schema.Types.ObjectId,
         ref: "User"
      },

      name: String,

      rating: Number,

      comment: String
   }
],

rating: {
   type: Number,
   default: 0
},

numReviews: {
   type: Number,
   default: 0
},
    featured:{
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Product', productSchema)