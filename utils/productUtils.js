const Product = require('../models/Product');

async function getProductsByRFID(rfidTag) {
  try {
    const product = await Product.findOne({ rfid: rfidTag }).exec();
    if (!product) {
      return { error: 'No product found with the specified RFID tag' };
    }
    return product;
  } catch (err) {
    // Handle unexpected error
    console.error(err);
    return { error: 'An error occurred while fetching product' };
  }
}

module.exports = {
  getProductsByRFID
};