const {Router} = require('express')
const Course = require('../controllers/courseController')
const router = Router()

router.get('/getCourses',Course.getCourses)
router.post('/addCourse',Course.addCourse)
router.delete('/deleteCourse',Course.deleteCourse)
module.exports = router;