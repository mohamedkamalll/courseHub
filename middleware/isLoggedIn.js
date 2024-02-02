module.exports = function isLoggedIn(req, res, next)
{
    try {
        if(req.isAuthenticated())
        {
        // user will be authenticated
        next();
        }
        else
        {
        // return unauthorized user
        res.status(401).send("Unauthorized");
        }    
    } catch (error) {
       return next(error)
    }

};