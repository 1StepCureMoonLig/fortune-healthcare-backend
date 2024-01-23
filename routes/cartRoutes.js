const {Router} = require('express')
const categoryProduct = require('../controllers/categoryProduct')
const router = Router();

router.put('/', categoryProduct.updateCart);
router.get('/', categoryProduct.finalCart);

module.exports = router