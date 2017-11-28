const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'ba_map',
  max: 20,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 1500,
})

module.exports = pool