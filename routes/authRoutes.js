const {Router} = require('express')
const router = Router()
const auth = require('../controllers/authController');
const isLoggedIn = require('../middleware/isLoggedIn');


/* router.post('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.send(req.user.profile);
    }
); */
router.post('/login', auth.logIn);

router.get('/auth/google', auth.googleAuth);
router.get('/auth/google/callback', auth.googleAuthCallBack);

router.get('/login', (req, res) => {res.render('index')})

router.get('/logout', isLoggedIn, auth.logout)

module.exports = router;