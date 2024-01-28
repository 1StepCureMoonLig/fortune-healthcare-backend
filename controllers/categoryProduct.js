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

        if (category) {
            query.categoryName = category;
        }

        if (product) {
            query._id= product;
        }
        const result = await Product.find(query);
        debug(result)

        res.status(200).json({ products: result });
    } catch (error) {
        debug(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCart = async (req, res) => {
    const cartData = req.body;
    const userId = req.cookies.ftune;
    const secretKey = "Mnet2024";

    if (userId) {
        debug("inside usedid");
        jwt.verify(userId, secretKey, async (err, decodedToken) => {
            if (err) {
                res.status(403).json("Invalid token");
            } else {
                try {
                    let existingCart = await Cart.findOne({ user: decodedToken.id });

                    if (!existingCart) {
                        debug("inside cart")
                        existingCart = new Cart({
                            user: decodedToken.id,
                            cartDetails: cartData.cartDetails
                        });
                    } else {
                        cartData.cartDetails.forEach((item) => {
                            const productIndex = existingCart.cartDetails.findIndex(
                                (cartItem) => cartItem.product_id.toString() === item.product_id
                            );

                            if (productIndex !== -1) {
                                // Find or add the quantity entry in totalQty
                                item.totalQty.forEach((qty) => {
                                    const qtyIndex = existingCart.cartDetails[productIndex].totalQty.findIndex(
                                        (existingQty) => existingQty.quantity === qty.quantity
                                    );

                                    if (qtyIndex !== -1) {
                                        // Update the count for the existing quantity
                                        existingCart.cartDetails[productIndex].totalQty[qtyIndex].count += qty.count;

                                        // Remove the quantity entry if count becomes zero or negative
                                        if (existingCart.cartDetails[productIndex].totalQty[qtyIndex].count <= 0) {
                                            existingCart.cartDetails[productIndex].totalQty.splice(qtyIndex, 1);
                                        }
                                    } else if (qty.count > 0) {
                                        // If the quantity doesn't exist, add a new entry if count is nonzero
                                        existingCart.cartDetails[productIndex].totalQty.push({
                                            quantity: qty.quantity,
                                            count: qty.count
                                        });
                                    }
                                });
                            } else {
                                // If the product is not found, add it to the cart
                                existingCart.cartDetails.push({
                                    product_id: item.product_id,
                                    totalQty: item.totalQty
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


// const finalCart = async (req, res) => {
//     debug("inside cart");
//     const userId = req.cookies.ftune;
//     const secretKey = "Mnet2024";

//     if (userId) {
//         debug("inside usedid");
//         jwt.verify(userId, secretKey, async (err, decodedToken) => {
//             if (err) {
//                 res.status(403).json("Invalid token");
//             } else {
//                 try {
//                     let gotCart = await Cart.findOne({ user: decodedToken.id })
//                         .populate({
//                             path: 'cartDetails.product_id',
//                             select: 'productName use',
//                             populate: {
//                                 path: 'price',
//                                 model: 'Product',
//                                 select: 'quantity cost' // Include cost in the selection
//                             }
//                         });

//                     // Adjust the response structure and map cost to totalQty
//                     const adjustedCart = gotCart.cartDetails.map((cartDetail) => {
//                         const adjustedProduct = { ...cartDetail.product_id._doc };
//                         adjustedProduct.price = adjustedProduct.price.map((price) => {
//                             const cartDetailPrice = cartDetail.product_id.price.find(
//                                 (cartPrice) => cartPrice._id.toString() === price._id.toString()
//                             );
//                             return {
//                                 ...price._doc,
//                                 count: cartDetailPrice ? cartDetailPrice.count : 0
//                             };
//                         });

//                         // Map cost to totalQty based on quantity
//                         const totalQtyWithCost = cartDetail.totalQty.map((qty) => {
//                             const correspondingPrice = adjustedProduct.price.find(
//                                 (price) => price.quantity === qty.quantity
//                             );
//                             return {
//                                 ...qty._doc,
//                                 cost: correspondingPrice ? correspondingPrice.cost : 0
//                             };
//                         });

//                         return {
//                             ...cartDetail._doc,
//                             product_id: adjustedProduct,
//                             totalQty: totalQtyWithCost
//                         };
//                     });

//                     res.status(200).json(adjustedCart);
//                 } catch (err) {
//                     res.status(500).json(err.message);
//                 }
//             }
//         });
//     } else {
//         res.status(400).json({ message: 'Missing userId in cookies' });
//     }
// };

// const finalCart = async (req, res) => {
//     debug("inside cart");
//     const userId = req.cookies.ftune;
//     const secretKey = "Mnet2024";

//     if (userId) {
//         debug("inside usedid");
//         jwt.verify(userId, secretKey, async (err, decodedToken) => {
//             if (err) {
//                 res.status(403).json("Invalid token");
//             } else {
//                 try {
//                     let gotCart = await Cart.findOne({ user: decodedToken.id })
//                         .populate({
//                             path: 'cartDetails.product_id',
//                             select: 'productName use',
//                             populate: {
//                                 path: 'price',
//                                 model: 'Product',
//                                 select: 'quantity cost' // Include cost in the selection
//                             }
//                         });

//                     // Adjust the response structure and map cost to totalQty
//                     const adjustedCart = gotCart.cartDetails.map((cartDetail) => {
//                         const adjustedProduct = { ...cartDetail.product_id._doc };
//                         // Exclude the price array from the adjustedProduct
//                         delete adjustedProduct.price;

//                         // Map cost to totalQty based on quantity
//                         const totalQtyWithCost = cartDetail.totalQty.map((qty) => {
//                             const correspondingPrice = cartDetail.product_id.price.find(
//                                 (price) => price.quantity === qty.quantity
//                             );
//                             return {
//                                 ...qty._doc,
//                                 cost: correspondingPrice ? correspondingPrice.cost : 0
//                             };
//                         });

//                         return {
//                             ...cartDetail._doc,
//                             product_id: adjustedProduct,
//                             totalQty: totalQtyWithCost
//                         };
//                     });

//                     res.status(200).json(adjustedCart);
//                 } catch (err) {
//                     res.status(500).json(err.message);
//                 }
//             }
//         });
//     } else {
//         res.status(400).json({ message: 'Missing userId in cookies' });
//     }
// };



const finalCart = async (req, res) => {
    debug("inside cart");
    const userId = req.cookies.ftune;
    const secretKey = "Mnet2024";

    if (userId) {
        debug("inside usedid");
        jwt.verify(userId, secretKey, async (err, decodedToken) => {
            if (err) {
                res.status(403).json("Invalid token");
            } else {
                try {
                    let gotCart = await Cart.findOne({ user: decodedToken.id })
                        .populate({
                            path: 'cartDetails.product_id',
                            select: 'productName use prodImgLink',
                            populate: {
                                path: 'price',
                                model: 'Product',
                                select: 'quantity cost'
                            }
                        });

                    // Check if the cart is empty
                    if (!gotCart || gotCart.cartDetails.length === 0) {
                        return res.status(200).json({ message: 'Cart is empty. Continue shopping.' });
                    }

                    // Adjust the response structure and map cost to totalQty
                    const adjustedCart = gotCart.cartDetails.map((cartDetail) => {
                        const adjustedProduct = { ...cartDetail.product_id._doc };
                        // Exclude the price array from the adjustedProduct
                        delete adjustedProduct.price;

                        // Map cost to totalQty based on quantity
                        const totalQtyWithCost = cartDetail.totalQty.map((qty) => {
                            const correspondingPrice = cartDetail.product_id.price.find(
                                (price) => price.quantity === qty.quantity
                            );
                            return {
                                ...qty._doc,
                                cost: correspondingPrice ? correspondingPrice.cost : 0
                            };
                        });

                        return {
                            ...cartDetail._doc,
                            product_id: adjustedProduct,
                            totalQty: totalQtyWithCost
                        };
                    });
                    res.status(200).json(adjustedCart);
                } catch (err) {
                    res.status(500).json(err.message);
                }
            }
        });
    } else {
        res.status(400).json({ message: 'Missing userId in cookies' });
    }
};



module.exports ={addCategoryProduct, getCategoryProduct, updateCart, finalCart}