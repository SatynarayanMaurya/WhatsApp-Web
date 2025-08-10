const mongoose = require("mongoose")

exports.db = ()=>{
    mongoose.connect(process.env.DB_URL)
    .then(()=>console.log("DB Connected Successfully"))
    .catch((error)=>{
        console.log("DB Connection failed : ",error)
        process.exit(1)
    })
}