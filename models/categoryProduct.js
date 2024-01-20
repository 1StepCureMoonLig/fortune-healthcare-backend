const mongoose = require('mongoose')


// const category = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true
//     },
//     products: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product'
//     }]
// })
const product = new mongoose.Schema({
    categoryName :{
        type: String,
        required: true
    },
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
                type: Number,
                required: true
            }
        }
    ],
    productIntro : String,
    benefits : String
})
    const cart = new mongoose.Schema({
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        cartDetails:[
            {
                product_id:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                count :{
                    type : Number,
                    default : 0
                }
            }
        ]
    })
// const Category = mongoose.model('Category', category);
const Product = mongoose.model('Product', product);
const Cart = mongoose.model('Cart', cart);


module.exports = {Product, Cart}