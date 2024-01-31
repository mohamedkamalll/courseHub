const {Router} = require('express')
const router = Router()
const auth = require('../controllers/authController')

router.use((req,res,next)=>{
  console.log(`${req.method}:${req.url}`,req.session.passport ?req.session.passport : req.session )
  console.log(req.isAuthenticated())
  next()
})

router.post('/login' ,auth.logIn);

router.get('/auth/google',auth.googleAuth);
router.get('/auth/google/callback', auth.googleAuthCallBack);

router.get('/login',(req,res)=>{ res.render('index')})
        
router.get('/logout',auth.logout)

module.exports = router;