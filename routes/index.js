const authRoutes = require('./authRoutes')
const checkoutRoutes = require('./checkoutRoutes')
const collectionRoutes = require('./collectionRoutes')

const initRoutes = app => {
    app.use('/auth', authRoutes)
    app.use('/checkout', checkoutRoutes)
    app.use('/collection', collectionRoutes)
}

module.exports = initRoutes