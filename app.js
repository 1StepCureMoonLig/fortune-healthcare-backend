require('dotenv').config();

const debug = require('debug')('server:app')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const initDatabase = require('./config/database')
const initRoutes = require('./routes')

const app = express()
const options = {
	credentials: true,
	origin: 'https://main--chic-sable-f59f7b.netlify.app'
}

app.use(cors(options))
app.use(cookieParser())	
app.use(express.json())

initDatabase()
initRoutes(app)

 app.get('/', (_, res) => res.send('Yoo css noobie'))

const port = process.env.PORT || 5000
app.listen(port, () => {
	debug(`Server is up and running on port ${port}`)
})