
var db = require('../config/connections')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
module.exports = {


    addTeachersData: (teachersData) => {
        return new Promise(async (resolve, reject) => {
            teachersData.Password = await bcrypt.hash(teachersData.Password, 10)
            db.get().collection(collection.TEACHERS_DATA_COLLECTION).insertOne(teachersData).then((response) => {
                resolve(response.ops[0]._id)
                //console.log(response.ops[0]._id);
            })
        })
    },

    getTeachersData: () => {
        return new Promise(async (resolve, reject) => {
            var dptSort = { Department: 1,Name:1}
            let teachersValues = await db.get().collection(collection.TEACHERS_DATA_COLLECTION).find().sort(dptSort).toArray()
            resolve(teachersValues)
        })
    },

    addStaffsData: (staffsData) => {
        return new Promise(async (resolve, reject) => {
            staffsData.Password = await bcrypt.hash(staffsData.Password, 10)
            db.get().collection(collection.STAFF_DATA_COLLECTION).insertOne(staffsData).then((response) => {
                resolve(response.ops[0]._id)
                //console.log(response.ops[0]._id);
            })
        })
    },

    getstaffsData: () => {
        return new Promise(async (resolve, reject) => {
            let staffsValues = await db.get().collection(collection.STAFF_DATA_COLLECTION).find().toArray()
            resolve(staffsValues)
            //console.log(staffsValues);
        })
    },
}