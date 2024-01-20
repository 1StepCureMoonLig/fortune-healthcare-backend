const {Router} = require('express')
const categoryProduct = require('../controllers/categoryProduct')
const searchBar = require('../controllers/searchBar')
const router = Router();

router.get('/get', categoryProduct.getCategoryProduct);
router.post('/addProduct', categoryProduct.addCategoryProduct);
router.put('/cart', categoryProduct.getCart);
router.post('/search', searchBar.getSearchResult)

module.exports = router