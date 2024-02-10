const passport = require('passport');
require('../auth/passport-config')

let User = {
  firstName: null,
  lastName: null,
  birthDate: null,
  email: null,
  city: null,
  role: null,
  phone: null,
  username: null
}

module.exports.logIn = async (req, res, next) => {
        passport.authenticate('local',function (error, user) {
          if(error){
            return next(error) 
           }
          req.logIn(user, function (err) { // <-- Log user in
            console.log(user,"loginnnn")
            if(err){
             return next(err) 
            } else{
              const {firstName,lastName,birthDate,email,city,role,phone,username} = user
              User = {firstName,lastName,birthDate,email,city,role,phone,username}               
              res.status(200).send(User); 
            }
        });
        }
        )(req, res, next);
}

module.exports.googleAuth = function(req, res, next) {
  passport.authenticate('google', { scope:
        [ 'email', 'profile' ] }
  )(req, res, next);
}

module.exports.googleAuthCallBack = async (req, res, next) => {
  passport.authenticate('google',function (error, user) {
    if(error){
      return next(error) 
     }
    req.logIn(user, function (err) { // <-- Log user in
      //console.log(user,"loginnnn")
      if(err){
       return next(err) 
      } else{
        res.status(200).send("heloooooooo"); 
      }
  });
  }
  )(req, res, next);
}
/* module.exports.googleAuthCallBack = passport.authenticate('google', { failureRedirect: '/login' }),
async function(req, res) {  
  // Successful authentication, redirect home.
  await req.logIn(user,{session:true}, function (err) { // <-- Log user in
  //console.log(user,"loginnnn")
  if(err) throw Error(err) 
  return res.redirect('/'); 
  });  
} */

module.exports.logout = (req,res)=>{
  req.logOut( function (err) { // <-- Log user in
    //console.log(user,"logedouttt")
      if(err) throw Error(err) 
      return res.redirect('/login'); 
    });  

}