const sql = require('mssql')
const config = require('./databaseConfig.json')


const poolPromise = new sql.ConnectionPool(config[1])
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, poolPromise
}