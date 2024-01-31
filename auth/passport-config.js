const localStrategy = require('passport-local').Strategy
const {getUser , getUserById,createAndGetGmailId} = require("../controllers/userController")
const passport = require('passport');
const bcrypt = require('bcrypt');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


function intialize(){
    let request 
    
    const authenticateUser = async (req, email , password , done) =>{
        request = req
        console.log(req.body, "requestttttttttt")
        console.log(email,password)
        let user =await  getUser(email,req)
        console.log(user,"userr")
        if (user == null){
            console.log('invalid user name')
            return done(null,false,{message: 'no user with that email'})

        }


        try {
            if(await bcrypt.compare(password,user.password)){
                return done(null,user)
            }else{
                console.log('password incorrect')
                return done(null , false, {message : 'password incorrect'})
            }
        } catch (error) {
            return done(error)
        }
    }
    
    passport.use(new localStrategy({usernameField : 'email',passwordField:'password', passReqToCallback : true},
    authenticateUser))
    //console.log(user,"serializeeeeer")
   
    passport.use(new GoogleStrategy({
        clientID:     "452115457423-p5s00qlhp9pvdo7m8ghnv00rcan0co9p.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:5000/auth/google/callback",
        passReqToCallback   : true
      },
      async function(req, accessToken, refreshToken, profile, done) {
        request = req
        try {
            user = await createAndGetGmailId(profile.email,profile.id,req) 
            console.log(user,"from passport . use")         
            if(user){
                done(null, user);
            }  else{
                console.log('no user with that email')
                return done(null,false,{message: 'no user with that email'})
            }
        } catch (error) {
            console.log(error)
        }
            //console.log(profile,"profilee")
    
      }
    ));
    passport.serializeUser((user,done) =>{ 
        console.log("serialize ", user.userId)
        done(null,user.userId)
      })
    passport.deserializeUser(async function (id,done){
        console.log("de serialize ", id)
        try {
            const deserializeUserr = await getUserById(id,request)
            if(!deserializeUserr) throw Error("User not found")
            done(null,deserializeUserr) 
                         
        } catch (error) {
            console.log(error)
            done(error,null)
        }
    })   
}

intialize()

