require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const Product = require('../models/Product');

const router = express.Router();

router.post("/orders", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: 60, // amount in smallest currency unit
            currency: "INR",
            receipt: "receipt_order_74394",
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});
router.post("/fetchBill", async (req, res) => {
    try {
        let products = req.body.products
        const product = await Product.findById(products[0]);
        if (product == null) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({
            products: product,
            total: product.price
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;