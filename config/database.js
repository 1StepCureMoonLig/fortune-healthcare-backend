const debug = require('debug')('server:database')
const mongoose = require('mongoose')

const initDatabase = () => {
	debug('Initializing Database Connection...')
	let dbUri = process.env.DB_URI 
	let options = {}

	mongoose.connect(dbUri, options)
	
	const connection = mongoose.connection
	connection.on('connected', () => debug('Connnected to Database'))
	connection.on('error', err => debug(`Database error: ${err}`))
	connection.on('disconnected', () => debug('Disconnnected from Database'))
	connection.on('reconnected', () => debug('Reconnnected to Database'))
}

module.exports = initDatabase