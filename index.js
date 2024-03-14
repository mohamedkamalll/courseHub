const express = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport');
//comment to test termux git

//Routes
const userRoutes = require('./routes/userRoutes')
const instructorRoutes = require('./routes/instructorRoutes')
const parentRoutes = require('./routes/parentRoutes');
const authRoutes = require('./routes/authRoutes')
const courseRoutes = require('./routes/courseRoutes')
const app = express()

//Middlewares
const errorHandler = require('./middleware/errorHandler');
const myLogger = require('./middleware/myLogger');
const deviceDetector = require('./middleware/deviceDetector');

//create database and connection pool
//const appPool = require('./config/database').excute()
const config = require('./config/databaseConfig.json')
const createDatabase = require('./config/createDatabase')
async function testConnection()
{
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
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,

}
app.use(cors(corsOptions));

//app.use(deviceDetector)

const { rateLimit } =require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

//Create the session

const MSSQLStore = require('connect-mssql-v2');
  const store =  new MSSQLStore(config[1],{
 ttl: 1000 * 60 * 60 * 24 * 5,
 // ttl: 1000 * 60 * 2,
  autoRemove: true,
  //  autoRemoveInterval: 1000 * 60 * 60,
  autoRemoveInterval: 1000 * 60 * 10,
  autoRemoveCallback: () => console.log("auto remove called"),
  useUTC: true,
  })
store.destroyExpired(()=>{
  console.log("session store started")
})



app.use(session({
  store: store,
  secret: "Cat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure:false,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    httpOnly: true
  },
}))




app.use(passport.initialize())
app.use(passport.session())
app.use(myLogger)


app.use(userRoutes)
app.use(authRoutes)
app.use(parentRoutes)
app.use(instructorRoutes)
app.use(courseRoutes)




//the middleware for handling errors
app.use(errorHandler)

//test moment
const moment = require("moment")

console.log(moment("2015-12-10", "YYYY-MM-DD").fromNow(true).replace(/[^0-9]/g, ""))

const server = app.listen(5000, function ()
{
  const host = server.address().address
  const port = server.address().port
  console.log('app listening at ', port)

})




