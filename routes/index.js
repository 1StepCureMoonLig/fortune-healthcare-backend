const authRoutes = require('./authRoutes')
const checkoutRoutes = require('./checkoutRoutes')
const collectionRoutes = require('./collectionRoutes')
const cartRoutes = require('./cartRoutes')

const initRoutes = app => {
    app.use('/auth', authRoutes)
    app.use('/checkout', checkoutRoutes)
    app.use('/product', collectionRoutes)
    app.use('/cart', cartRoutes)
}

module.exports = initRoutes