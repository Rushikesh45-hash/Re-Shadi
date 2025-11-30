import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name:process.env.cloudinary_cloud_name,
    api_key:process.env.cloudinary_Api_key,
    api_secreat_key:process.env.cloudinary_Api_secreatkey
});


const uploadcloudinary = async(localpath)=>{
    try {
        if(!localpath) return;
        //file uploaded on cloud with cloudinary localpath is path where we save this file temporarily which in our local path
        const result=await cloudinary.uploader.upload(localpath,{resource_type:"auto"});
        console.log("Success upload",result.url);
        return result;
    } catch (error) {
        fs.unlinkSync(localpath);//this removes locallly saved file from our syatem
        return null;
    }
}

export {uploadcloudinary}