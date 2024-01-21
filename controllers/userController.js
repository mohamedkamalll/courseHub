const { v5, v1 } = require('uuid');
//const database = require('../config/databaseConnection');
const {isEmail} = require('validator');
const generator = require('generate-password');
import("sernam").then(({ default: sernam }) => {
    const options = {
      symbols: true,
      numbers: true,
    }
     sn = sernam(options)
  })

let request;

module.exports.createUser= async (user,req,res) => {
    request = req

    const {FirstName ,LastName ,Age ,Email ,Password ,City ,Role } = user;
    try {
        const UserId = v5(Email,v1())
    if(isEmail(Email)){
        const existed = await isExisted(Email,'email')
        if(!existed){
            query = `INSERT INTO users (userId ,firstName ,lastName ,age ,email ,password ,city ,role)
            VALUES ('${UserId}','${FirstName}' ,'${LastName}' ,${Age} ,'${Email}' ,'${Password}' ,'${City}' ,'${Role}');`
            //throwQuery(query)
            await request.app.locals.db.query(query)
            return UserId;
        }else{
            throw Error("Email is already existed")
        }

    }else{
        throw Error("Email is not valid")
    }
    } catch (error) {
        console.log(error.message)
    }
    
}


module.exports.addChild = async (child, city ,fatherName,parentId)=>{
    const {name , age } = child;   
    let username = await sn.generateOne(name + fatherName)
    const Password = await generator.generate({
        length: 10,
        numbers: true
    });
    try {
        console.log(Password);
        console.log(username,"user nameeeeeeeeeeeeeeeee")
            const existed = await isExisted(username,'username')
            if (existed){
                username = await createUniqueUsername(name,fatherName)
            } 
            let UserId = v5(name,v1())
            query = `INSERT INTO users (userId ,firstName ,lastName ,age ,password ,city ,role ,username)
            VALUES ('${UserId}','${name}' ,'${fatherName}' ,${age} ,'${Password}' ,'${city}' ,'student', '${username}');`
            await request.app.locals.db.query(query)
            console.log(name ,age ,city,fatherName,username,UserId,parentId);
            await request.app.locals.db.query(`INSERT INTO students (userId,parentId) VALUES ('${UserId}',${parentId});`)
            return {"username" :username  , "password" : Password};        
    } catch (error) {
        console.log(error)
    }

}

async function createUniqueUsername(name,fatherName){
    try {
        let username = await sn.generateOne(name + fatherName)
        const existed = await isExisted(username,'username')
        if (existed){
            username = await createUniqueUsername(username)
        } else{
            return username;
        } 
    } catch (error) {
        console.log(error)
    }
    
}

async function isExisted(Email,type){
    const Existed  = await request.app.locals.db.query(`SELECT * FROM users where ${type} = '${Email}'`)

    console.log(Existed,Existed.rowsAffected,Email,type)
    if(Existed.rowsAffected == 1){
        return true
    }else{
        console.log("not existed")
        return false
    }
}