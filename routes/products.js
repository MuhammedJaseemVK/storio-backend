const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Middleware to get a specific product by ID
async function getProduct(req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.product = product;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific product by ID
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product);
});

// Create a new product
router.post('/', async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            rfid: req.body.rfid,
            brand: req.body.brand,
            category: req.body.category,
            image: req.body.image,
            quantity: req.body.quantity,
            weight: req.body.weight,
            dimensions: req.body.dimensions,
            material: req.body.material,
            color: req.body.color,
            features: req.body.features,
            rating: req.body.rating
        });

        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const errors = {};
            for (const field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            return res.status(400).json({ message: 'Validation error', errors });
        }

        // Handle duplicate key error
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(409).json({
                message: `Product with ${field}: ${err.keyValue[field]} already exists`
            });
        }

        // Handle unexpected error
        res.status(500).json({ message: err.message });
    }
});

// Get products by RFID tag
router.get('/rfid/:rfid', async (req, res) => {
    try {
        const rfidTag = req.params.rfid;
        const products = await Product.find({ rfid: rfidTag }).exec();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found with the specified RFID tag' });
        }
        res.json(products);
    } catch (err) {
        // Handle unexpected error
        console.error(err);
        res.status(500).json({ message: 'An error occurred while fetching products' });
    }
});

module.exports = router;