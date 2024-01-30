const express = require('express')
const { requireAuth } = require('../middlewares/authmiddlewares')
const checkoutController = require('../controllers/checkoutController')
const multer = require('multer');
const upload = multer();


const router = express.Router()

router.post('/', checkoutController.mailCheckoutDetails)
router.post('/prescription', upload.none(), checkoutController.prescription)
router.post('/feedBack', checkoutController.feedBack)


// router.get('/', requireAuth, checkoutController.temp) // for test

module.exports = router