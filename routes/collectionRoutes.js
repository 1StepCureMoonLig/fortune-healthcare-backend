const {Router} = require('express')
const categoryProduct = require('../controllers/categoryProduct')
const router = Router();

router.post('/category', categoryProduct.getCategory);
router.post('/product', categoryProduct.getProduct);
router.post('/addProduct', categoryProduct.addProduct);
router.post('/addCategory', categoryProduct.addCategory);

module.exports = router