
import express from 'express'
//const app=express();

const router=express.Router();//
import { verify, generate} from "../Authentication.js"

import menu from  "../Models/voter_item.js";
import validate from "../validator/auth_validatro_voter.js";
import middlewares from "../middleware/validate_middleware.js";
import validates from "../validator/Password_Change_validator.js"
import Candidate from "../Models/candidate_item.js"

router.post('/register',middlewares(validate),async(req, res) => {
    try{
        const data=req.body;
        //console.log(data)
    const newmenu=new menu(data);// Assign all data in newperson variable
   const response=await newmenu.save();
   
   
 
   
        console.log("Data Saved successsfully");
 res.status(200).json({response: response});
   }
   catch(err){
    console.log(err);
    res.status(500).json({error:"Internetserver error"});
   }
    
   })
//Login Route
router.post("/login",async(req,res)=>{
    try{
        //extract Username and password from request server
        const{ email,password}=req.body;
        const user=await menu.findOne({ email:  email});
        if(!user || !(await user.comparepassword(password))){
            return res.status(401).json({error: "Invalid username or password"});
        }
//Generate Token
// instead of generate({ userId: user._id })
const token = generate(user._id.toString());


console.log("Token is for voter: "+token);
res.json({token})


    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internet issue"});
    }
})



router.get('/get',verify,async(req,res)=>{
try{
     const userId = req.userId;
    //let newmenu=menu;
    const user = await menu.findById(userId);
    console.log("Data fected suceessfully");
   
    res.status(200).json(user);
 


}
catch(err){
    console.log(err);
res.status(500).json({error:"Internetserver error"});
}
})

router.post("/vote",verify,async(req,res)=>{
    try{
       // req.userId = decoded.userId; // plain string now

       const userId = req.userId; // Using the userId from verify middleware
const { candidateId } = req.body;
        // Find user
        const user = await menu.findById(userId);
        if(!user){
            console.log("Please fill the login and signup at 1st");
            res.status(401).json({error: "Plaese fill the login & signup form"});
        }
        if(user.hasvoted){
            res.status(200).json("Voter has already complete his voting");
            return;
        }
        if(user.role!=="voter"){
            res.status(401).json({error: "Voter is not eligible for voting"});
        }
        user.hasvoted=true;
        user.complete=true;
        user.votedAt = new Date();
        const candidate = await Candidate.findById(candidateId);
        console.log(candidate)
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
console.log(candidate.name)
    candidate.votes= candidate.votes+1;
    await candidate.save();
        await user.save();
        res.status(200).json("Now, voter is done his vote");
    }
    catch(err){
        console.log(err);
         res.status(500).json({error: "Internet issue"});
    }
})//


// ...existing code...

router.put("/ChangePassword", verify,middlewares(validates), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Input validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both current password and new password are required"
            });
        }

        // Password strength validation
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long"
            });
        }

        // Get user from token
        const userId = req.userId; // Using the userId from verify middleware

        // Find user
        const user = await menu.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify current password
        const isPasswordValid = await user.comparepassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Check if new password is same as old password
        const isSamePassword = await user.comparepassword(newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password"
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) {
        console.error("Password change error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            //error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});
export default router;