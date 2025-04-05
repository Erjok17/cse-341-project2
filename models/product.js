const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 100 
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price must be positive'] 
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'clothing', 'food']
  },
  description: String,
  inStock: { 
    type: Boolean, 
    default: true 
  },
  tags: [String],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);