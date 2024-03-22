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


module.exports.createCourses = async (req,res,next) => {
    try {
      const pool = await poolPromise
      query = `INSERT INTO academyCourses (courseName,courseLevel,coursePrice,courseImage,courseDescription) VALUES ('Scratch',1,3000,'s','jkhguyfgthg'),('python',1,4000,'m','jkhguyfgthg'),('Html , Css',2,3500,'l','jkhguyfgthg'),('JavaScript',2,3800,'hh','jkhguyfgthg');`
      await pool.request().query(query)    
      return res.status(200).send("Added Successfully");    
    } catch (error) {
      next(error.message)    
    }
  }

/*
module.exports.addCourse = async(req,res,next) => {
    try {
        const {courseName,courseLevel,coursePrice,courseImage,courseDescription} = req.body
        console.log(courseName,courseLevel,coursePrice,courseImage,courseDescription)
        const pool = await poolPromise
        await pool.request().query(`INSERT INTO academyCourses (courseName,courseLevel,coursePrice,courseImage,courseDescription) VALUES ('${courseName}',${courseLevel},${coursePrice},'${courseImage}','${courseDescription}')`)  
        return res.status(200).send("added Successfully");
    } catch (error) {
        next(error.message)        
    }
}
*/

module.exports.addCourse = async (req,res,next) => {
    try {
        const { image } = req.files;
        const {courseName,courseLevel,coursePrice,courseDescription} = req.body

        if (!image) throw new Error("cant add course without image");
    
        const pool = await poolPromise
        await pool.request().query(`INSERT INTO academyCourses (courseName,courseLevel,coursePrice,courseImage,courseDescription) VALUES ('${courseName}',${courseLevel},${coursePrice},'${courseName}','${courseDescription}')`)  

        image.mv(process.cwd() + '/views/Cards/' + courseName +'.jpg');
        return res.status(200).send("added Successfully");
    } catch (error) {
      next(error.message)    
    }
  }

