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

module.exports.addCourse = async(req,res,next) => {
    try {
        const {courseName, courseLevel} = req.body
        console.log(courseName,courseLevel)
        const pool = await poolPromise
        await pool.request().query(`INSERT INTO academyCourses (courseName,courseLevel) VALUES ('${courseName}',${courseLevel})`)  
        return res.status(200).send("added Successfully");
    } catch (error) {
        next(error.message)        
    }
}

module.exports.deleteCourse = async(req,res,next) => {
    try {
        const {courseName} = req.body
        console.log(courseName)
        const pool = await poolPromise
        const responsee = await pool.request().query(`DELETE FROM academyCourses WHERE courseName = '${courseName}'`)  
        console.log(responsee)
        return res.status(200).send("deleted Successfully");
    } catch (error) {
        next(error.message)        
    }
}