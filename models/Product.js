const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  productindex:{
    type: Number,
    required: true
  },
  rfid: {
    type: String,
    required: true,
    unique: true
  },
  brand: String,
  category: {
    type: String,
    enum: ['Electronics', 'Clothing', 'Home', 'Sports'],
    required: true
  },
  image: String,
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  material: String,
  color: String,
  features: [String],
  rating: {
    type: Number,
    min: 0,
    max: 5
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;