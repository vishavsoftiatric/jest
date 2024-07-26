const Product = require('../models/product');

// Create a new product
exports.createProduct = async (req, res) => {
    const { productName, stockAvailability, productClass, vendorName, price, imageUrl } = req.body;
    try {
        const newProduct = new Product({ productName, stockAvailability, productClass, vendorName, price, imageUrl });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single product by productId
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ productId: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { productName, stockAvailability, productClass, vendorName, price, imageUrl } = req.body;
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { productId: req.params.id },
            { productName, stockAvailability, productClass, vendorName, price, imageUrl },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ productId: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
