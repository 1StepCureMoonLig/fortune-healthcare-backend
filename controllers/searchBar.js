const debug = require('debug')('server:app');
const Fuse = require('fuse.js');
const { Product } = require('../models/categoryProduct');

const getSearchResult = async (req, res) => {
    try {
        const result = [];
        const searchParam = req.body.searchParam;
        debug(searchParam);
        const allProducts = await Product.find().exec();
        const fuseOptions = {
            keys: ['productName'],
        };
        const fuse = new Fuse(allProducts, fuseOptions);// Create a new instance of Fuse with the product data and options
        const searchResults = fuse.search(searchParam);
        searchResults.forEach(({ item }) => {
            result.push({ product: item.productName, prodId: item._id });// Extract the product information from the search results

        });
        debug(result);
        res.status(200).json(result);
    } catch (err) {
        debug(err);
        res.status(500).json(err);
    }
};

module.exports = {
    getSearchResult
};
