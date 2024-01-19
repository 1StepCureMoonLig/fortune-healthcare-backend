const debug = require('debug')('server:app')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const initDatabase = require('./config/database')
const authRoutes = require('./routes/authRoutes')
const { requireAuth } = require('./middlewares/authmiddlewares');
const collectionRoutes = require('./routes/collectionRoutes')
// const initRoutes = require('./routes')
require('dotenv').config()

const app = express()
const options = {
	credentials: true,
	origin: ['http://localhost:4200', 'https://thecrypt2.vercel.app', 'https://thecrypt2-git-dev-nekros1712.vercel.app']
}

app.use(cors(options))
app.use(cookieParser())	
app.use(express.json())
app.use(authRoutes, collectionRoutes)

initDatabase()
// initRoutes(app)

// app.get('/',requireAuth, (_, res) => res.send('Yoo css noobie')) 
 app.get('/', (_, res) => res.send('Yoo css noobie'))

const port = process.env.PORT || 3000
app.listen(port, () => {
	debug(`Server is up and running on port ${port}`)
})