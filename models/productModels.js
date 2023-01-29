const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    image: [
      {
        url: {
          type: String,
        },
        publicId: {
          type: String,
        },
      },
    ],
    category: { type: String },
    description: { type: String },
    countInStock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    user: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      username: {
        type: String,
      },
    },
  },

  {
    timestamps: true,
  }
);

const AllProduct = mongoose.model('AllProduct', productSchema);

module.exports = AllProduct;
