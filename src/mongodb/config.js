const mongoose = require("mongoose");
require('dotenv').config();

const connectToMongo = ()=>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Connected to the database");
    }).catch((err)=>{
        console.log("Database connection failed: ", err);
    })
}

module.exports = connectToMongo;