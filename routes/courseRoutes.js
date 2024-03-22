const {Router} = require('express')
const Course = require('../controllers/courseController')
const router = Router()

router.get('/getCourses',Course.getCourses)
router.post('/addCourse',Course.addCourse)
router.get('/createCourses',Course.createCourses)
router.delete('/deleteCourse',Course.deleteCourse)


router.get('/upload', (req, res) => {res.render('uploadImage')})
//router.post('/uploadImage',Course.uploadImage)


module.exports = router;