const mongoose = require('mongoose')


const category = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
})
const product = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    brand: String,
    activeIngredient: String,
    use: String,
    USABrandName: String,
    price: [
        {
            quantity: {
                type: Number,
                required: true
            },
            cost: {
                type: String,
                required: true
            }
        }
    ],
    productintro : String,
    benifits : String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }

})

const Category = mongoose.model('Category', category);
const Product = mongoose.model('Product', product);


module.exports = {Category, Product}