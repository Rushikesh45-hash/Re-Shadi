import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    user_name:{ type:String,required:true,unique:true,trim:true,lowercase:true,index:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    age: {type:Number},
    full_name:{type:String,required:true,index:true},
    gender: {type:String},
    Hobbies:[{type:String,required:true}],
    location: {type:String},
    salary:{type:Number,required:true},
    mobile_No:{type:String,required:true,unique:true},
    education: {type:String},
    avatar: {type:String},//cloudinary url
    refreshToken: { type: String },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sentrequests: [{type: mongoose.Schema.Types.ObjectId,ref: "User",index: true}],
    recivedrequests: [{type: mongoose.Schema.Types.ObjectId,ref: "User",index: true}],
    acceptedmatches: [{type: mongoose.Schema.Types.ObjectId,ref: "User",index: true}],
    Verified: { type: Boolean, default: false },
    lastactive: { type: Date, default: Date.now },
    bio:{type:String,required:true}
},{timestamps:true});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    
});


//custom methods this is nothing but simple function which is created by coder on schema
userSchema.methods.ischeckpassword = async function(password){
    return await bcrypt.compare(password,  this.password);
}

userSchema.methods.generateaccesstoken = function(){
    return jwt.sign({
        _id:this._id,
        name:this.user_name
    },process.env.access_token,
    {expiresIn:process.env.access_expiry})
}

userSchema.methods.generaterefreshtoken = function(){
     return jwt.sign({
        _id:this._id,
    },process.env.refresh_token,
    {expiresIn:process.env.refresh_expiry})
}


export const user = mongoose.model("User",userSchema)