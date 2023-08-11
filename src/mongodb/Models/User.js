const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    
    mobile:{
        type: String,
        maxlength :10,
        unique: true
    },
    isRegistered:{
        type: Boolean,
        default: false
    },
    email:{
        type: String
    },
    name:{
        type:String,
    },
    gender:{
        type: Number,
        enum: [1,2,3]  //1 is male, 2 is female and 3 is other
    },
    age:{
        type:Number,
    },
    address:{
        type: String
    },
    city:{
        type: String
    },
    pincode:{
        type: String
    },
    country:{
        type: String
    },
    role:{
        type: Number,
        default: 1, // 1 is user and 2 is admin
        enum: [1, 2]
    },
    testResponse:[
        {
            type:Number,
            // 1 means option A. 2 means option B.....
        }
    ],
    lastTestDate:{
        type: Date
    }

},
{timestamps: true}

);

module.exports = mongoose.model("User", UserSchema);