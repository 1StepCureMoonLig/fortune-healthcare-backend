const {Router} = require('express')
const categoryProduct = require('../controllers/categoryProduct')
const searchBar = require('../controllers/searchBar')
const router = Router();

router.get('/', categoryProduct.getCategoryProduct);
router.post('/', categoryProduct.addCategoryProduct);
router.post('/reviews', categoryProduct.reviewDB);


module.exports = router