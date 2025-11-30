import {asynchandler} from "../utils/asynchandler.js";

const signupuser=asynchandler(async (req, res)=>{
    res.status(200).json({message:"Ok, Hello Rushikesh"});
    //first we need to take data from frontend but till now we take data from postman
    //validation of data 
    //check if user already exists using name and email
    // check for avatar
    //upload them to clodinary
    //create user object and create entry in db
    //remove password and refresh token from response
    // check for user creation and send response
    const {full_name,user_name,email,password} = req.body
    console.log("email",email)
})


export {signupuser}