const passport = require('passport');
require('../auth/passport-config')

module.exports.logIn = async (req, res, next) => {
        passport.authenticate('local',function (err, user) {
          req.logIn(user, function (err) { // <-- Log user in
            console.log(user,"loginnnn")
            if(err) throw Error(err) 
            return res.redirect('/'); 
        });
        }
        )(req, res, next);
}

module.exports.googleAuth = function(req, res, next) {
  passport.authenticate('google', { scope:
        [ 'email', 'profile' ] }
  )(req, res, next);
}

module.exports.googleAuthCallBack = passport.authenticate('google', { failureRedirect: '/login' }),
async function(req, res) {
// Successful authentication, redirect home.
  await req.logIn(user,{session:true}, function (err) { // <-- Log user in
  //console.log(user,"loginnnn")
  if(err) throw Error(err) 
  return res.redirect('/'); 
  });  
}

module.exports.logout = (req,res)=>{
  req.logOut( function (err) { // <-- Log user in
    //console.log(user,"logedouttt")
      if(err) throw Error(err) 
      return res.redirect('/login'); 
    });  

}