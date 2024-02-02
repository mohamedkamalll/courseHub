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
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

//Middlewares
const errorHandler = require('./middleware/errorHandler');
const myLogger = require('./middleware/myLogger');



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
app.use(myLogger)


app.use(userRoutes)
app.use(authRoutes)
app.use(parentRoutes)
app.use(instructorRoutes)


//the middleware for handling errors
app.use(errorHandler)

const server = app.listen(5000, function () {
  const host = server.address().address
  const port = server.address().port
  console.log('app listening at ', port)
})





