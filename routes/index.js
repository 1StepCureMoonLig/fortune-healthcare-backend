const authRoutes = require('./authRoutes')
const checkoutRoutes = require('./checkoutRoutes')

const initRoutes = app => {
    app.use('/auth', authRoutes)
    app.use('/checkout', checkoutRoutes)
}

module.exports = initRoutes