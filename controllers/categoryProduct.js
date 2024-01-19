const User = require('../models/user');
const categoryProduct = require('../models/categoryProduct')
const debug = require('debug')('server:app')


const addProduct = async (req, res) => {
   
}

const getCategory = async (req,res) => {
    
}

const getProduct = async (req,res) => {
    
}

const addCategory = async (req, res) => {
    const {category} = req.body
    try{
        const newCategory = categoryProduct.Category.create({
            category    
        });
        res.status(200).json(category);
    }catch(err){
        debug(err)
    }
}

module.exports ={addProduct, getCategory, getProduct, addCategory}