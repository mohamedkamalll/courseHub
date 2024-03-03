const user = require('./userController')
const {poolPromise} = require('../config/db')
const {sendMail} = require('../config/email')
const {v5, v1} = require('uuid');

/*
{
"parentEmail" : "momoooi4111iq166o@gmail.com",
"parentFirstName" : "taherrrr",
"parentLastName" : "ahmeddd",
"parentPhone" : "01234516488",
"parentCity" : "cairo",
"parentPassword" : "351518hdsjgghjb",
"fatherName" : "taherrrr",
"students" :[ {"name": "ramaaa", "age": 8},{"name" : "tamerrrr" , "age" : 9}]
}
*/

let children = []


module.exports.addParent = async (req, res, next) =>
{
  const {parentFirstName, parentLastName, parentEmail, parentPassword, parentCity, fatherName, students} = req.body;
  console.log(req.body)
  try
  {
    const userId = await user.createUser({
      firstName: parentFirstName,
      lastName: parentLastName,
      birthDate: null,
      email: parentEmail,
      password: parentPassword,
      city: parentCity,
      role: 'parent',
      activated:1
    }, req)

    console.log("doneeee")
    //   console.log("Done",userId)
    const pool = await poolPromise
    await pool.request().query(`INSERT INTO parents (userId) VALUES ('${userId}');`)
    parentId = await pool.request().query(`select parentId from parents  where userId = '${userId}';`)
    console.log(parentId.recordset[0].parentId)
    students.forEach(async (element) =>
    {
      console.log("child num ")
      let child = await user.addChild(element, parentCity, fatherName, parentId.recordset[0].parentId);
      sendChildren(students.length, child);

    })
    return res.status(200).send("Done");

  } catch (error)
  {
    next(error)
  }

}

let body = "<table  style='border:1px solid #ccc;text-align: left;border-collapse: collapse;width: 100%;'> <tbody>";

async function sendChildren(len, child)
{
  children.push(child)
  body += `<tr style='border: 1px solid #ccc;text-align: left;padding: 15px;'>
  <td style='border: 1px solid #ccc;text-align: left;padding: 15px;width:200px;background-color:#ddd;'>Email : </td>
  <td style='border: 1px solid #ccc;text-align: left;padding: 15px;'>  ${child.username} </td>
  </tr>
  <tr style='border: 1px solid #ccc;text-align: left;padding: 15px;'>
  <td style='border: 1px solid #ccc;text-align: left;padding: 15px;width:200px;background-color:#ddd;'>Password : </td>
  <td style='border: 1px solid #ccc;text-align: left;padding: 15px;'>  ${child.password} </td>
  </tr>`;
  if (children.length == len)
  {
    console.log(children, "doneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    body += "</tbody></table> ";
    //await sendMail("Your children accounts",body)
  }
}




