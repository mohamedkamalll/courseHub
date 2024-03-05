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
  username: null,
  activated: null
}

module.exports.logIn = async (req, res, next) =>
{
  passport.authenticate('local', function (error, user)
  {
    if (error)
    {
      return next(error)
    }
    req.logIn(user, function (err)
    { // <-- Log user in
      console.log(user, "loginnnn")
      if (err)
      {
        return next(err)
      } else
      {
        const {firstName, lastName, birthDate, email, city, role, phone, username, activated} = user
        User = {firstName, lastName, birthDate, email, city, role, phone, username, activated}
        return res.status(200).send(User);
      }
    });
  }
  )(req, res, next);
}

module.exports.googleAuth = function (req, res, next)
{
  passport.authenticate('google', {
    scope: ['email', 'profile']
  }
  )(req, res, next);
}

module.exports.googleAuthCallBack = async (req, res, next) =>
{
  passport.authenticate('google', function (error, user)
  {
    console.log("caleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed")
    if (error)
    {
      return next(error)
    }
    req.logIn(user, function (err)
    { // <-- Log user in
      //console.log(user,"loginnnn")
      if (err)
      {
        return next(err)
      } else
      {
        const {firstName, lastName, birthDate, email, city, role, phone, username, activated} = user
        User = {firstName, lastName, birthDate, email, city, role, phone, username, activated}
        //      return res.status(200).send(User);
        return res.send("<script>window.close();</script > ");
      }
    });
  }
  )(req, res, next);
}


module.exports.logout = (req, res) =>
{
  req.logOut(function (err)
  { // <-- Log user in
    //console.log(user,"logedouttt")
    if (err) return next(err)
    return res.status(200).send(true);
  });
}