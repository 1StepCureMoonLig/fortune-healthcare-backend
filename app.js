const debug = require('debug')('server:app')
const express = require('express')
const cors = require('cors')
// const initDatabase = require('./config/database')
// const initRoutes = require('./routes')
require('dotenv').config()

const app = express()
const options = {
	credentials: true,
	origin: ['http://localhost:4200', 'https://thecrypt2.vercel.app', 'https://thecrypt2-git-dev-nekros1712.vercel.app']
}

app.use(cors(options))
app.use(express.json())

// initDatabase()
// initRoutes(app)

app.get('/', (_, res) => res.send('Server up and running!!'))

const port = process.env.PORT || 3000
app.listen(port, () => {
	debug(`Server is up and running on port ${port}!!`)
})