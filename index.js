const express = require('express');
const sql = require('mssql')
const createDatabase = require('./config/createDatabase')
//const database = require('./config/databaseConnection');
const instructorRoutes = require('./routes/instructorRoutes')
const parentRoutes = require('./routes/parentRoutes');
const config = require('./config/databaseConfig.json')



async function testConnection(){
  await createDatabase.checkDatabase()   
}

testConnection()

const appPool = new sql.ConnectionPool(config[1])
const app = express()
app.use(express.json())


app.get('/',(req,res)=>{
    const query  = `SELECT * FROM users
    INNER JOIN instructors ON users.userId=instructors.userId;`
    //console.log(throwQuery(query))
    //throwQuery(query)
    res.send("hello")
})

app.use(parentRoutes)
app.use(instructorRoutes)

//app.listen(5000,()=>{
//    console.log("Connected on 5000")
//})

appPool.connect().then(function(pool) {
    app.locals.db = pool;
    const server = app.listen(5000, function () {
      const host = server.address().address
      const port = server.address().port
      console.log('app listening at ', port)
    })
  }).catch(function(err) {
    console.error('Error creating connection pool', err)
  });
