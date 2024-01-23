const express = require('express')
const { requireAuth } = require('../middlewares/authmiddlewares')
const checkoutController = require('../controllers/checkoutController')

const router = express.Router()

router.post('/', requireAuth, checkoutController.mailCheckoutDetails)
router.post('/prescription', requireAuth, checkoutController.mailCheckoutDetails)

// router.get('/', requireAuth, checkoutController.temp) // for test

module.exports = router