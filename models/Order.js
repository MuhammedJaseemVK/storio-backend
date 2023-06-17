const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId:{
    type: String,
    required: true
  },
  customerId: {
    type: String,
    required: true
  },
  // paymentInfo: {
  //   // paymentMethod: {
  //   //   type: String,
  //   //   enum: ['credit card', 'debit card', 'paypal', 'bitcoin'],
  //   //   required: true
  //   // },
  //   // cardNumber: {
  //   //   type: String,
  //   //   required: function() {
  //   //     return this.paymentInfo.paymentMethod === 'credit card' || this.paymentInfo.paymentMethod === 'debit card';
  //   //   }
  //   // },
  //   // cardHolderName: {
  //   //   type: String,
  //   //   required: function() {
  //   //     return this.paymentInfo.paymentMethod === 'credit card' || this.paymentInfo.paymentMethod === 'debit card';
  //   //   }
  //   // },
  //   // expirationDate: {
  //   //   type: Date,
  //   //   required: function() {
  //   //     return this.paymentInfo.paymentMethod === 'credit card' || this.paymentInfo.paymentMethod === 'debit card';
  //   //   }
  //   // },
  //   // paypalEmail: {
  //   //   type: String,
  //   //   required: function() {
  //   //     return this.paymentInfo.paymentMethod === 'paypal';
  //   //   }
  //   // },
  //   // bitcoinAddress: {
  //   //   type: String,
  //   //   required: function() {
  //   //     return this.paymentInfo.paymentMethod === 'bitcoin';
  //   //   }
  //   // }
  // },
  orderTotal: {
    type: Number,
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String, 
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    index:{
      type: Number
    },
  }],
  razorpayPaymentId:{
    type: String,
  },
  razorpayOrderId:{
    type: String,
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
