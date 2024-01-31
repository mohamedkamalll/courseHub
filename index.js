const express = require('express');
const cookieParser =require('cookie-parser')
const session = require('express-session')
const passport = require('passport');


//Routes
const userRoutes = require('./routes/userRoutes')
const instructorRoutes = require('./routes/instructorRoutes')
const parentRoutes = require('./routes/parentRoutes');
const authRoutes = require('./routes/authRoutes')
const app = express()


//create database and connection pool
//const appPool = require('./config/database').excute()
const config = require('./config/databaseConfig.json')
const createDatabase = require('./config/createDatabase')
async function testConnection(){
  await createDatabase.checkDatabase()   
}
testConnection()

// app use
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())


//allow frontend to access the back end 
var corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
const cors = require('cors');
app.use(cors(corsOptions))


//Create the session
const MSSQLStore = require('connect-mssql-v2');
const store = new MSSQLStore(config[1],{
  ttl: 1000 * 60 * 60 * 24 * 5,
  autoRemove: true,
  autoRemoveInterval: 1000 * 60 * 60,
  autoRemoveCallback: () => console.log("auto remove called"),
  useUTC: true
});
app.use(session({
  store: store,
  secret : "Cat",
  resave: false,
  saveUninitialized: false,
}))


app.use(passport.initialize())
app.use(passport.session())

app.use(userRoutes)
app.use(authRoutes)
app.use(parentRoutes)
app.use(instructorRoutes)




const server = app.listen(5000, function () {
  const host = server.address().address
  const port = server.address().port
  console.log('app listening at ', port)
})





