const {Router} = require('express');
const user = require('../controllers/userController');
const isLoggedIn = require('../middleware/isLoggedIn');

const router = Router()


router.get('/isLoggedIn', user.checkAuth)
router.get('/updatePassword', isLoggedIn, user.updatePassword)
router.get('/getCurrentUser',isLoggedIn,user.getCurrentUser)
router.post('/forgetPassword', user.forgetPassword)

module.exports = router