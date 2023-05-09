const knex = require('knex')
const config = ('../knexfile.js')
const db = knex(config)
//const knex = require('knex')(config)

//knex.migrate.latest([config])
module.exports = db