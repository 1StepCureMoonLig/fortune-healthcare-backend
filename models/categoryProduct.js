const mongoose = require('mongoose')


const category = new mongoose.Schema({
    category : String
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
    benifits : String

})

const Category = mongoose.model('category', category)
const Product = mongoose.model('product', product)


module.exports = {Category, Product}