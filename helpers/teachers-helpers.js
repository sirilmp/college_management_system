var db = require('../config/connections');
var collection = require('../config/collections');
var bcrypt = require('bcrypt');



module.exports = {
    doLoggedin: (loginData) => {
        return new Promise(async(resolve, reject) => {
            let loginStatus = false
            let response = {}
            let teacher = await db.get().collection(collection.TEACHERS_DATA_COLLECTION).findOne({ Email: loginData.Email })
            if (teacher) {
               // console.log(teacher);
                bcrypt.compare(loginData.Password, teacher.Password).then((status) => {
                    if (status) {
                        console.log("login completed");
                        response.teacher=teacher
                        response.status=true
                        resolve(response)
                    } else {
                        console.log("login not completde");
                        resolve({status:false})
                    }
                })
            } else {
                console.log("Email not found");
                resolve({status:false})
            }
        })
    }
}

