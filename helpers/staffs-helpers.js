var db = require('../config/connections');
var collection = require('../config/collections');
var bcrypt = require('bcrypt');
const { response } = require('express');



module.exports = {

    doLoggedin: (loginData) => {

        return new Promise(async (resolve, reject) => {

            let loginStatus = false

            let response = {}

            let staff = await db.get().collection(collection.STAFF_DATA_COLLECTION).findOne({ Email: loginData.Email })

            if (staff) {

                //console.log(staff);

                bcrypt.compare(loginData.Password, staff.Password).then((status) => {

                    if (status) {

                        console.log("login completed");

                        response.staff = staff

                        // console.log(staff);

                        response.status = true

                        resolve(response)

                    } else {

                        // console.log("login not completde");

                        resolve({ status: false })
                    }
                })

            } else {
                //  console.log("Email not found");

                resolve({ status: false })
            }
        })
    },
    //add student datas
    addStudentsData: (studentData) => {

        return new Promise(async (resolve, reject) => {

            studentData.Password = await bcrypt.hash(studentData.Password, 10)

            //studentData.RePassword = await bcrypt.hash(studentData.RePassword, 10)
         
            db.get().collection(collection.STUDENT_DATA_COLLECTION).insertOne(studentData).then((response) => {

                resolve(response.ops[0]._id)

                //console.log(response.ops[0]._id);
            })
        })
    },

    getStudentsData: () => {

        return new Promise(async (resolve, reject) => {

            var sortedSudentData={Department:1,Name:1}

            let studentsValues = db.get().collection(collection.STUDENT_DATA_COLLECTION).find().sort(sortedSudentData).toArray()

            //console.log(studentsValues);

            resolve(studentsValues)

        })

    },

    getStudentsFeeData: () => {

        return new Promise(async (resolve, reject) => {

            var sorted = {Sem: 1, Date: 1}

            let studentsFeeValues = await db.get().collection(collection.FEE_DATA_STORE).aggregate([

                // {
                //     $match: { studentsValues.RegNo:RegNoNo}
                // },

                {
                    $lookup: {
                        from: (collection.STUDENT_DATA_COLLECTION),

                        localField: "RegNo",

                        foreignField: "RegNo",

                        as: "studentFeeData"
                    }
                },


                {
                    $unwind: '$studentFeeData'
                },

            ]).sort(sorted).toArray()

            resolve(studentsFeeValues)
           
            //console.log(studentsFeeValues.studentFeeData);

        })
    },



    checkFeeData: (checkingData) => {

        return new Promise(async (resolve, reject) => {

            let response = {}
            /* checking student RegNo */

            let checkStudentData = await db.get().collection(collection.STUDENT_DATA_COLLECTION).findOne({ RegNo: checkingData.RegNo })

            if (checkStudentData) {

                //console.log("RegNo Finded in student collection");

                response.checkStudentData = checkStudentData

                /* checking fee data */

                let checkFeeData = await db.get().collection(collection.FEE_DATA_STORE).findOne({ RegNo: checkingData.RegNo, Sem: checkingData.Sem })

                if (checkFeeData) {

                    //console.log("RegNo & Sem finded in fee collections");

                    //let Due = parseInt(checkFeeData.Due)

                    Due = checkFeeData.Due

                    // console.log(checkingData);

                    response.checkFeeData = checkFeeData

                    response.Due = Due - checkingData.Amount

                    if (response.Due < 0) {

                        // console.log("Due is negtive number");

                        response.due = true

                        response.Sem = checkingData.Sem

                        response.Amount = checkingData.Amount

                        resolve(response)

                    } else {

                        response.Amount = checkingData.Amount

                        response.Date = checkingData.Date

                        resolve(response)
                    }


                    //console.log(checkingData.Amount);

                } else {

                    //console.log("did not find fee datas", checkingData);

                    response.checkStudentData = checkStudentData

                    response.Due = checkingData.Total - checkingData.Amount

                    if (response.Due < 0) {

                        response.due = true

                        response.Sem = checkingData.Sem

                        response.Amount = checkingData.Amount

                        resolve(response)

                    } else {

                        response.Amount = checkingData.Amount

                        response.Total = checkingData.Total

                        response.Sem = checkingData.Sem

                        response.Date = checkingData.Date

                        resolve(response)

                    }

                }

            } else {

                //console.log("RegNo did not Finded in student collection");

                response.student = true

                response.RegNo = checkingData.RegNo

                resolve(response)

            }
        })
    },



    addFeeSatus: (feeData) => {

        return new Promise(async (resolve, reject) => {

            let feeDataAdd = await db.get().collection(collection.FEE_DATA_STORE).findOne({ RegNo: feeData.RegNo, Sem: feeData.Sem })

            if (feeDataAdd) {

                feeDueUpdate = feeData.Due

                feeAmountUpdate = feeData.Amount

                feeDateUpdate = feeData.Date

                db.get().collection(collection.FEE_DATA_STORE).updateOne({ RegNo: feeData.RegNo, Sem: feeData.Sem },
                    {
                        $set:

                            { Due: feeDueUpdate, Amount: feeAmountUpdate, Date: feeDateUpdate }

                    })

                _id = feeData._id

                RegNo = feeData.RegNo

                Sem = feeData.Sem

                Total = feeData.Total

                Due = feeData.Due

                Amount = feeData.Amount

                Date_of_Pay = feeData.Date

                SiNo = feeData.SiNo

                db.get().collection(collection.ALL_FEE_DATA).insertOne({ _id, RegNo, Sem, Total, Due, Amount, Date_of_Pay })

            } else {

                console.log(feeData);

                db.get().collection(collection.FEE_DATA_STORE).insertOne(feeData)

                _id = feeData._id

                RegNo = feeData.RegNo

                Sem = feeData.Sem

                Total = feeData.Total

                Due = feeData.Due

                Amount = feeData.Amount

                Date_of_Pay = feeData.Date

                db.get().collection(collection.ALL_FEE_DATA).insertOne({ _id, RegNo, Sem, Total, Due, Amount, Date_of_Pay })

            }

            resolve()

        })

    },
}

