const myLogger = (req,res,next)=>{
    try {
        console.log(`${req.method}:${req.url}`,req.session.passport ?req.session.passport : req.session )
        console.log(req.isAuthenticated())
        next()        
    } catch (error) {
       // return next(error)
       next()
    }

}

module.exports = myLogger;