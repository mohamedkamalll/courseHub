const sql = require('mssql')
//const { readFileSync } = require("fs");
const config = require('./databaseConfig.json')


//const createDatabase =require('./createDatabase')

 

exports.connect = async (query) => {

  //  const config = JSON.parse(readFileSync('./databaseConfig.json','utf-8'))

  try {
      let pool = await sql.connect(config[0])
      await pool.request().query(`Use academy`) 
      result = await pool.request().query(query)
      //console.log("Connection done from dumy")
      //console.log(result)
      //sql.close()
      return(result)
  } catch (err) {
   console.log(err)
  }
}




























/*

const sql = require('mssql')
const { readFileSync } = require("fs");


const createDatabase =require('./createDatabase')

 

exports.connect = async (query) => {

    const config = JSON.parse(readFileSync('./databaseConfig.json','utf-8'))

  try {
      await sql.connect(config[0])
      await sql.query(`Use academy`)
      result = await sql.query(query)
      //console.log("Connection done from dumy")
      return(result)
  } catch (err) {
   console.log(err)
  }
}

*/
