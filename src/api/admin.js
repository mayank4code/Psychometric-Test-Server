const router = require('express').Router();
const User = require("../mongodb/Models/User");
const Question = require("../mongodb/Models/Question");
const fetchPerson = require("../middlewares");


router.get('/get-users', fetchPerson, async(req,res)=>{
    if(req.isAdmin===false){
        return res.status(403).json({success: false, message: "Unauthorized access"});
    }

    try {
        const allUsers = await User.find();
        res.status(200).json({success: true, message: "Users fetched successfully", allUsers});
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error", err: error.message});
    }
})

router.post("/add-question", fetchPerson, async(req, res)=>{
    if(req.isAdmin===false){
        return res.status(403).json({success: false, message: "Unauthorized access"});
    }

    // {questionsText, [option1, option2, option3, option4]}    
    //Question is already validated from the frontend

    try {
        const newQuestion = new Question(req.body);
        const question = await newQuestion.save();

        res.status(200).json({success: true, message: "Question added successfully", question});
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error", error: error.message});
    }
})

router.put("/update-question/:id", fetchPerson, async(req,res)=>{
    if(req.isAdmin===false){
        return res.status(403).json({success: false, message: "Unauthorized access"});
    }
    const questionID = req.params.id;

    try {
        const newQuestion = await Question.findByIdAndUpdate(questionID, req.body, {new: true});
        res.status(200).json({success: true, message: "Question updated successfully", newQuestion});
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error", err: error.message});
    }
})

router.delete("/delete-question/:id", fetchPerson, async (req,res)=>{
    if(req.isAdmin===false){
        return res.status(403).json({success: false, message: "Unauthorized access"});
    }
    const questionID = req.params.id;

    try {
        const deletedQuestion = await Question.findByIdAndDelete(questionID);
        res.status(200).json({success: true, message: "Question deleted successfully", deletedQuestion});
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error", err: error.message});
    }

})





module.exports = router;