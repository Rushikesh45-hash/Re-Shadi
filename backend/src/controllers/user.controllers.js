import {asynchandler} from "../utils/asynchandler.js";
import { Apierror } from "../utils/apierror.js";
import {user} from "../models/user.js";
import {uploadcloudinary} from "../utils/cloudinary.js"
import{Apiresponse} from "../utils/response.js"

const signupuser=asynchandler(async (req, res,next)=>{
    const {full_name,user_name,email,password,age,gender,Hobbies,location,salary,mobile_No,education,bio,avatar} = req.body
    // if(full_name === "" || user_name === "" || email === "" || age ==="" || password === "" || gender=== ""|| Hobbies=== ""|| location===""|| salary=== "" || mobile_No === "" || education === "" || bio === ""){
    //     throw new Apierror(400, "All fields are required")
    // }
    const requiredFields = [
        full_name, user_name, email, password, age,gender, Hobbies, location, salary,mobile_No, education, bio
    ];
    if (requiredFields.some(field => field === undefined || String(field).trim() === "")) {
        throw new Apierror(400, "All fields are required");
    }

    const existeduser=await user.findOne({$or:[{user_name},{email}]})
    if(existeduser){throw new Apierror(409, "User_name or email already exist, please use different one or login ")}

    const avatarlocalpath=req.file?.path;
   // console.log(avatarlocalpath, typeof(avatarlocalpath))
    if(!avatarlocalpath){
        throw new Apierror(400,"Avatar is required")}

    const avatarurl = await uploadcloudinary(avatarlocalpath);
    if(!avatarurl){
        throw new Apierror(400,"Error in avatar upload middleware")
    }
    const userdata=await user.create({
        user_name,full_name,email,age,password,gender,Hobbies,location,salary,mobile_No,education,bio,avatar:avatarurl.url})

    const createduser=await user.findById(userdata._id).select(
        "-password -refreshToken"
    )//this is for cheking purpose if user is create in database or not
    //and this .select is method is used to remove this from database means we don't  need to save this in database
    if(!createduser){throw new Apierror(500,"something went wrong")}

    return res.status(200).json(
        new Apiresponse(200, userdata, "User created successfully")
    );
})
export {signupuser}

