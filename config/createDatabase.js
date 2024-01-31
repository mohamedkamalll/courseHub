const sql = require('mssql')
const schema = require('./schema')
const config = require('./databaseConfig.json')

//const config = JSON.parse(readFileSync('./databaseConfig.json','utf-8'))

//createConnection(config[0])
module.exports.checkDatabase = async() =>{
  try {
       await sql.connect(config[0])
       const isExist = await sql.query(`IF EXISTS 
       (SELECT name FROM master.dbo.sysdatabases WHERE ('[' + name + ']' = N'academy' OR name = N'academy'))
       BEGIN
       SELECT '1' AS code
       END
       ELSE
       BEGIN
       SELECT '0' AS code
       END`)
      console.log(isExist.recordset[0].code)
      if(isExist.recordset[0].code == '0'){
         createDatabase()
         console.log('created successfully')

      }else{
        console.log('connected successfully')
        sql.close()
        //await sql.query(`Use academy`)
        //const users = await sql.query(`SELECT * FROM users`)
        //console.log(users)

      }
  } catch (err) {
   console.log(err)
  }
}

async function createDatabase(){
  try {
    const result = await sql.query(`create database academy`)    
    await sql.query(`Use academy`)
   // console.log(schema)
    await sql.query(schema)
  console.log(config)

  } catch (error) {
    console.log(error)    
  }
}









/*
const sqlConfig = {
  user: 'mo',
  password: '542moo',
  //database: 'mydb',
  server: 'localhost\\MSSQLSERVER',
  trustServerCertificate: true,
    pool: {
    max: 10,
    min: 0
    }
}
*/
/*
h = async () => {
 try {
    console.log(45)
  // make sure that any items are correctly URL encoded in the connection string
  await sql.connect(sqlConfig)
  const result = await sql.query(`create database academy`)
  console.log(result)
 } catch (err) {
  // ... error checks
  console.log(err)
 }
}
*/



