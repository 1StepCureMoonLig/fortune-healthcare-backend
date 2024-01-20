const User = require('../models/user');
const {Product, Cart} = require('../models/categoryProduct')
const debug = require('debug')('server:app')
const jwt = require('jsonwebtoken')

const addCategoryProduct = async (req, res) => {
    const { categories, products } = req.body;

    try {

        if (products) {
            await Product.insertMany(products);
            res.status(201).json({ message: 'Products added successfully' });
        }
    } catch (error) {
        debug(error);
        res.status(500).json({ message: error.message });
    }
};
const getCategoryProduct = async (req, res) => {
    const { category, product } = req.query;
    try {
        const query ={};
        debug(category,product)

        if (category) {
            query.categoryName = category;
        }

        if (product) {
            query._id= product;
        }

        const result = await Product.find(query);

        res.status(200).json({ products: result });
    } catch (error) {
        debug(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// const getCart = async (req,res) => {
//     const cartData = req.body;
//     const userId = req.cookies.ftune;
//     const secretKey = "Mnet2024"
//     if(userId){
//         jwt.verify(userId,secretKey, async (err,decodedToken) =>
//         {
//             if(err){
//                 res.status(403).json("Bhak")
//             }else{
//                 try{
//                     let existingCart = await Cart.findOne({user: decodedToken.id, cartDetails: cartData.cartDetails.product_id});
//                     let productSearch =await Cart.findOne({
//                         user: decodedToken.id,
//                         cartDetails: {
//                             $elemMatch: {
//                                 product_id: cartData.cartDetails.product_id
//                             }
//                         }
                       
//                     });
//                     if(!existingCart){
//                         debug("inside !exixstingCart")
//                         existingCart = new Cart({
//                             user :  decodedToken.id,
//                             cartDetails : cartData.cartDetails
//                         })
//                         await existingCart.save();
//                     }
//                     const productIndex = existingCart.cartDetails.findIndex(
//                         (item) => item.product_id === cartData.cartDetails.product_id
//                     );
//                     debug(productIndex)
//                     if (productIndex !== -1) {
//                         // Update the count of the existing product in the cart
//                         existingCart.cartDetails[productIndex].count += cartData.cartDetails.count;
                
//                         // Save the updated cart to the database
//                         await existingCart.save();
                
//                         res.status(200).json(existingCart);
//                     } else {
//                         // If the product is not found in the cartDetails array, handle this case
//                         res.status(404).json({ message: 'Product not found in the cart' });
//                     }
//                     //existingCart.cartDetails = cartData.cartDetails;
//                     //await existingCart.save();
//                     //res.status(200).json(existingCart)
//                 }catch(err){
//                     debug(err)
//                 }
//                 //res.status(200).json("aaja andar")
//                 // debug(decodedToken.id)
//                 // const cart = await Cart.find({});
//                 // debug(cart)
//                 // res.status(200).json(cart)
//             }
//         })
//     }else{
//         res.status(400).json("token lek ah")
//     }
// }

const getCart = async (req, res) => {
    const cartData = req.body;
    const userId = req.cookies.ftune;
    const secretKey = "Mnet2024";

    if (userId) {
        jwt.verify(userId, secretKey, async (err, decodedToken) => {
            if (err) {
                res.status(403).json("Invalid token");
            } else {
                try {
                    let existingCart = await Cart.findOne({ user: decodedToken.id });

                    if (!existingCart) {
                        existingCart = new Cart({
                            user: decodedToken.id,
                            cartDetails: cartData.cartDetails
                        });
                    } else {
                        cartData.cartDetails.forEach((item) => {
                            const productIndex = existingCart.cartDetails.findIndex(
                                (cartItem) => cartItem.product_id.toString() === item.product_id// Update the count for each product in the existing cart

                            );

                            if (productIndex !== -1) {
                                existingCart.cartDetails[productIndex].count += item.count; // If the product is found adjust the count


                                if (existingCart.cartDetails[productIndex].count <= 0) {
                                    existingCart.cartDetails.splice(productIndex, 1); // If the count becomes zero or negative remove the product from the cart

                                }
                            } else if (item.count !== 0) {
                                existingCart.cartDetails.push({
                                    product_id: item.product_id, // If the product is not found and count is nonzero add the product to the cart

                                    count: item.count
                                });
                            }
                        });
                    }

                    await existingCart.save();
                    res.status(200).json(existingCart);
                } catch (err) {
                    debug(err);
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        });
    } else {
        res.status(400).json({ message: 'Missing userId in cookies' });
    }
};




module.exports ={addCategoryProduct, getCategoryProduct, getCart}