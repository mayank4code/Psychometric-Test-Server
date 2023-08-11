const router = require('express').Router();
const User = require("../mongodb/Models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fetchPerson = require("../middlewares");
const Question = require("../mongodb/Models/Question");


//Register
//Token must be there before this route is called.
//Middleware will verify if user has verified there number or logged in.
//!REGISTER or updating user can be done only single time. 
router.post("/register", fetchPerson,  async(req,res)=>{
    //* User is already created in login. We just have to update the user 

    const userId = req.mongoID;
    const user = await User.findById(userId);
    if(user.isRegistered===true){
        return res.status(403).json({success: false, message: "Already registered"});
    }

    req.body.isRegistered = true;

    try{
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {new:true});
        res.status(200).json({success: true, updatedUser});
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

//LOGIN
// ! Secure the API by using any code to request the APIs.
// ! IF MOBILE EXISTS UPDATE THE PASSWORD 
// ! ELSE CREATE USER WITH MOBILE AND PASSWORD
router.post("/login-create-password", async (req,res)=>{
    // console.log("login request received");
    //We only have mobile phone as input.
    // const passKey = req.headers.passKey;
    // console.log(passKey);
    try {
        let user = await User.findOne({mobile: req.body.mobile});

        if(!user){
            // User is not already registered, so do register
            const newUser = new User({mobile: req.body.mobile});
            //save user and response
            user = await newUser.save();
        }
        console.log("user: ", user);

        // generate token - expiry time is 24 hours
        const data = {
            exp: Math.floor(Date.now() / 1000) + 60*60*24,
            mongoID: user._id,
            isAdmin: user.role===2?true:false
        };
        const token = jwt.sign(data, process.env.JWT_SECRET);

        res.status(200).json({success: true, message: "Logged in successfully", token});

    } catch(err){
        res.status(500).json({success: false, message: err});
    }
})

router.post("/verify-user", fetchPerson, async (req,res)=>{
    
    res.json({success: true, message: "Token verified succesfully", isAdmin: req.isAdmin});
})

router.post("/get-user", fetchPerson, async (req,res)=>{
    try {
        const userDoc = await User.findById(req.mongoID);
        res.json({success: true, message: "User fetched successfully", userDoc});
        
    } catch (err) {
        res.status(500).json({success: false, message: err});
    }
    
})

router.post("/check-mobile-registered", async (req,res)=>{
    const phone = req.body.mobile
    try {
        const userDoc = User.findOne({mobile: phone});
        if(!userDoc){
            //user not found
            res.status(200).json({success: false, message: "Mobile number not registered"});
            return;
        }
        res.status(200).json({success: true, message: "Mobile number registered"});
    } catch (error) {
        res.status(500).json({success: false, message: err});
    }
})

//!Generate token also here
router.post("/check-password", async(req,res)=>{
    console.log("checking password");

})


//Get questions

router.get("/get-questions", fetchPerson, async (req,res)=>{

    try {
        const questions = await Question.find();
        res.status(200).json({success: true, message: "Questions fetched successfully", questions});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }

})

//Update test responses in user schema

router.put("/update-response", fetchPerson, async(req,res)=>{
    const userId = req.mongoID;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {testResponse: req.body.responses, lastTestDate: Date.now()}, {new:true});
        res.json({success:true, updatedUser});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
})



module.exports = router;