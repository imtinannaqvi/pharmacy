const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine', // Matches your existing inventory model
        required: true
      },
      name: String,
      image: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }
  ],
  totalAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);