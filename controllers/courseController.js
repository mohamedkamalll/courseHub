const { poolPromise } = require('../config/db')


module.exports.getCourses = async (req,res,next) => {
    try {
        const pool = await poolPromise
        const Courses = await pool.request().query(`SELECT * FROM academyCourses`)      
        return res.status(200).send(Courses.recordset);
    } catch (error) {
        next(error.message)
    }

}