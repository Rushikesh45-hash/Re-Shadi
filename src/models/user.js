import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    user_name:{ type:String,required:true,unique:true,trim:true,lowercase:true,index:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    age: {type:Number},
    Full_name:{type:String,required:true,index:true},
    gender: {type:String},
    Hobbies:[{type:String,required:true}],
    location: {type:String},
    salary:{type:Number,required:true},
    mobile_No:{type:String,required:true,unique:true},
    education: {type:String},
    Avatar: {type:String},//cloudinary url
    refreshToken: { type: String },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sentrequests: [{type: mongoose.Schema.Types.ObjectId,ref: "User",index: true}],
    recivedrequests: [{type: mongoose.Schema.Types.ObjectId,ref: "User",index: true}],
    acceptedmatches: [{type: mongoose.Schema.Types.ObjectId,ref: "User",index: true}],
    Verified: { type: Boolean, default: false },
    lastactive: { type: Date, default: Date.now },
    bio:{type:String,required:true}
},{timestamps:true});


export const user = mongoose.model("User",userSchema)