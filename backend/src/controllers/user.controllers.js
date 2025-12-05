import {asynchandler} from "../utils/asynchandler.js";
import { Apierror } from "../utils/apierror.js";
import {user} from "../models/user.js";
import {uploadcloudinary} from "../utils/cloudinary.js"
import{Apiresponse} from "../utils/response.js"
import jwt from "jsonwebtoken"


const generateaccessandrefreshtoken =async(userId)=>{
    try {
        const userr = await user.findById(userId)
        const  RefreshToken= userr.generaterefreshtoken()
        const AccessToken = userr.generateaccesstoken()
        console.log("Accesstoken =",AccessToken)
        console.log("Refreshtoken =",RefreshToken)
        userr.refreshToken = RefreshToken
        await userr.save({validateBeforeSave:false})
        return {AccessToken,RefreshToken}
        

    } catch (error) {
        console.log(error)
        throw new Apierror(500,"Error in token gggg generation")        
    }
}

const registeruser=asynchandler(async (req, res,next)=>{
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

const loginuser =asynchandler(async (req,res)=>{
    //take data frpm req.body
    //take username and email and check
    //if wrong then.. and if correct then password
    //then again check password if correct then generate this refresh token and access token
    //semd to user through cookies
    const {email,user_name,full_name,password}=req.body
    if(!user_name && !email){throw new Apierror(400,"One of username or email is required")}

    const usernamedata=await user.findOne({
        $or : [{user_name}, {email}]
    })

    if(!usernamedata){throw new Apierror(404, "YOu have to register first sir")}
    //Here we check if username or email given by user is present or not and if nt means user never register before

    const ispasswordcorrect = await usernamedata.ischeckpassword(password)
    if(!ispasswordcorrect){throw new Apierror(401,"Password is incorrect")}

    const {AccessToken, RefreshToken}=await generateaccessandrefreshtoken(usernamedata._id)
    //here we just generate access and refresh token for user
    const userloggedin=await user.findById(usernamedata._id).select("-password -refreshToken")
    const option = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("refreshToken",RefreshToken,option)
    .cookie("accesstoken",AccessToken,option)
    .json(
        new Apiresponse(200,{userloggedin,AccessToken,RefreshToken},"User logged in successfully")
    )//here we return or send the refresh and access token to user through cookies  

})

const logoutuser=asynchandler(async (req,res)=>{
        const dataa=await user.findByIdAndUpdate(
            req.user._id,{
                $set:{refreshToken:undefined}
            }
        )
         const option = {
        httpOnly:true,
        secure:true}
            console.log("Logout succesful")
         return res
            .clearCookie("accesstoken", option)
            .clearCookie("refreshToken", option)
            .status(200)
            .json({
                success: true,
                message: "User logged out successfully",
                data: dataa
            });
        
})

    const generatenewaccesstoken = asynchandler(async(req,res)=>{
        const incomingrefreshtoken= req.cookies.refreshToken || req.body.refreshToken
        if(!incomingrefreshtoken){
            throw new Apierror(401,"You are not logged in, please login to access this resource")
        }
        try {
            const decodedrefreshtoken=jwt.verify(incomingrefreshtoken,process.env.refresh_token)
            if(!decodedrefreshtoken){
                throw new Apierror(401,"Invalid refresh token or refreshtoken has expired, please login again")
            }
    
            const User=await user.findById(decodedrefreshtoken?._id)
            if(!User){
                throw new Apierror(401,"invalid refresh token")
            }
    
            if(User.refreshToken !== incomingrefreshtoken){
                throw new Apierror(401,"Token mismatch, please login again or Refreshtoken is expired")
            }
    
            const options={
                httpOnly:true,
                secure:true
            }
    
            const {AccessToken,RefreshToken}= await generateaccesstoken(User._id)
            return res
            .status(200)
            .cookie("accesstoken",AccessToken,RefreshToken,options)
            .json(
                new Apiresponse(200,{AccessToken,RefreshToken},"New access token generated successfully")
            )
        } catch (error) {
            console.log(error)
            throw new Apierror(401,"Invalid refresh token or refreshtoken has expired, please login again")
        }
    })

export {registeruser,loginuser,logoutuser,generatenewaccesstoken}

