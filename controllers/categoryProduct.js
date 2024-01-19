const User = require('../models/user');
const {Category, Product} = require('../models/categoryProduct')
const debug = require('debug')('server:app')


const addCategoryProduct = async (req, res) => {
    const { categories, products } = req.body;

    try {
        if (categories && categories.length > 0) {
            await Category.insertMany(categories);
        }

        if (products && products.length > 0) {
            await Product.insertMany(products);
        }

        if ((categories && categories.length > 0) && (products && products.length > 0)) {
            res.status(201).json({ message: 'Categories and products added successfully' });
        } else if (categories && categories.length > 0) {
            res.status(201).json({ message: 'Categories added successfully' });
        } else if (products && products.length > 0) {
            res.status(201).json({ message: 'Products added successfully' });
        } else {
            res.status(400).json({ message: 'Categories or products data is missing' });
        }
    } catch (error) {
        console.error(error.code);
        if(error.code===11000){
            res.status(400).json({ message: 'Category already exits' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getCategoryProduct = async (req, res) => {
    const { category, product } = req.query;
    try {
        let query = {};

        if (category) {
            query.category = category;
        }

        if (product) {
            query.productName = product;
        }

        const result = await Product.find(query);

        res.status(200).json({ products: result });
    } catch (error) {
        debug(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports ={addCategoryProduct, getCategoryProduct}