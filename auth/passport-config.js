const localStrategy = require('passport-local').Strategy
const {getUser , getUserById,createAndGetGmailId} = require("../controllers/userController")
const passport = require('passport');
const bcrypt = require('bcrypt');
var GoogleStrategy = require('passport-google-oauth2').Strategy;


function intialize(){
    let request     
    const authenticateUser = async (req ,email ,password ,done ) =>{
        request = req;
        console.log(req.body, "request.body");
        console.log(email,password);
        try {
            let user = await getUser(email,req);
            user = user.recordset[0]
            console.log(user,"userr");
            if (user == null){
                console.log('invalid user name')
                return done(new Error("no user with that email"),false)
            }
            if(await bcrypt.compare(password,user.password)){
                return done(null,user)
            }else{
                return done(new Error('password incorrect') , false)
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
            //console.log(user,"from passport . use")         
            if(user){
                done(null, user);
            }  else{
                
                return done(new Error('no user with that email'),false)
            }
        } catch (error) {
            return done(error)
        }
            //console.log(profile,"profilee")
    
      }
    ));

    //jwttttttttttt
    var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'secret';
    opts.issuer = 'accounts.examplesoft.com';
    opts.audience = 'yoursite.net';
    opts.passReqToCallback = true
    passport.use(new JwtStrategy(opts,async function(request,jwt_payload, done) {
        console.log(req.body, "request.body");
        console.log(email,password);
        try {
            let user = await getUser(email,req);
            user = user.recordset[0]
            console.log(user,"userr");
            if (user == null){
                console.log('invalid user name')
                return done(new Error("no user with that email"),false)
            }
            if(await bcrypt.compare(password,user.password)){
                return done(null,user)
            }else{
                return done(new Error('password incorrect') , false)
            }
        } catch (error) {
            return done(error)
        }
    }));

    ////////////////////////////////////////////
    
    try {
        passport.serializeUser((user,done) =>{ 
            console.log("serialize ", user.userId)
            done(null,user.userId)
          })
        passport.deserializeUser(async function (id,done){
            console.log("de serialize ", id)
            try {
                const deserializeUserr = await getUserById(id,request)

                if(!deserializeUserr) {throw Error("User not found")}else{
                    const {userId,
                        firstName,
                        lastName,
                        birthDate,
                        email,
                        city,
                        role,
                        phone,
                        username
                      } = deserializeUserr
                      User = {
                        userId,
                        firstName,
                        lastName,
                        birthDate,
                        email,
                        city,
                        role,
                        phone,
                        username}
                }
                done(null,User) 
                             
            } catch (error) {
                console.log(error,"error is hereeeeeeeeee")
                done(error,null)
            }
        })       
    } catch (error) {
        console.log(error,"erroris hereeeee")
    }
    
}

intialize()

