const {Router} = require('express')
const Course = require('../controllers/courseController')
const router = Router()

router.get('/getCourses',Course.getCourses)
module.exports = router;