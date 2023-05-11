require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

router.post("/orders", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });
        let { total } = req.query
        const options = {
            amount: total * 100, // amount in smallest currency unit
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
        product.quantity = product.quantity -1
        await product.save()

        if (product == null) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            products: [product],
            total: product.price
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/success', async (req, res) => {
    try {
        const { orderId, customerId, orderTotal, items, razorpayPaymentId, razorpayOrderId } = req.body;
        const order = new Order({
            orderId,
            customerId,
            orderTotal,
            items,
            razorpayPaymentId,
            razorpayOrderId
        });
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.get('/orders', async (req, res) => {
    try {
        const customerId = req.query.id;
        const orders = await Order.find({ customerId });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.get('/totalorders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


module.exports = router;