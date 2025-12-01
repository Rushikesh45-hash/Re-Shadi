import {asynchandler} from "../utils/asynchandler.js";
import { Apierror } from "../utils/apierror.js";
import {user} from "../models/user.js";
import {uploadcloudinary} from "../utils/cloudinary.js"
import{Apiresponse} from "../utils/response.js"

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
    console.log("email",email);
    console.log("Name", full_name);
    
    if(full_name === "" || user_name === "" || email === "" || age ==="" || password === "" || gender=== ""|| Hobbies=== ""|| location===""|| salary=== "" || mobile_No === "" || education === "" || bio === ""){
        throw new Apierror(400, "All fields are required")
    }

    // if([full_name,user_name,email,age,password,password,gender,Hobbies,location,salary,mobile_No,education,bio].some((field)=>field?.trim() === "")){
    //     throw new Apierror(400, "All fields are required")
    // }
    //this is optional method to check all fields are filled or not with if and some method

    const exiteduser=user.findone({$or:[{user_name},{email}]})
    if(exiteduser){throw new Apierror(409, "User_name or email already exist, please use different one or login ")}

    console.log("req.fiels",req.files)
    console.log("req.body",req.body)
    const avatarlocalpath=req.files?.avatar[0]?.path;
    if(!avatarlocalpath){
        throw new Apierror(400,"Avatar is required")
    }

    const avatar = await uploadcloudinary(avatarlocalpath);
    if(!avatar){
        throw new Apierror(400,"Avatar is required")
    }

    const userdata=await user.create({

    })
    await userdata.findbyId(userdata._id).select(
        "-password -refreshToken"
    )//this is for cheking purpose if user is create in database or not
    //and this .select is method is used to remove this from database means we don't  need to save this in database

    if(!userdata){throw new Apierror(500,"something went wrong")}

    return new Apiresponse(200,userdata,"User created successfully")




})


export {signupuser}