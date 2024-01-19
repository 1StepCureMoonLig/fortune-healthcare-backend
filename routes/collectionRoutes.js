const {Router} = require('express')
const categoryProduct = require('../controllers/categoryProduct')
const router = Router();

router.get('/get', categoryProduct.getCategoryProduct);
router.post('/addProduct', categoryProduct.addCategoryProduct);

module.exports = router