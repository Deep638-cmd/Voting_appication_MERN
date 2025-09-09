import mongoose from "mongoose"
import bcrypt from "bcryptjs";
const schema=new mongoose.Schema({
name:{
        type: String,
        require: true
    },
    age:{
        type: Number,
        require: true,
        min: 25,
        max:70
     
    },
    stream:{
        type: String,
         enum:["CSE","ECE","IT","ME","EE","CE"],
        require: true
    },
     email:{
        type: String,
        require: true,
        unique:true
    },
    password:{
        type: String,
    require: true
    },
    role:{
        type: String,
        enum:["voter","candidate"],
        require: true
    },
    votes:{
        type:Number,
        default:0
    }



})
schema.pre("save",async function(next){
    
     if(!this.isModified("password")){
   next();
  }
  try{
    const deep=this;
    const salt=await bcrypt.genSalt(12);
    const hashedpassword= await bcrypt.hash(deep.password,salt);
    deep.password=hashedpassword;
    next();
  }catch(err){
    console.log("errror");
    next(err);
  }

})
schema.methods.comparepassword=async function (currentpassword){
    const deep=this;
const compare=await bcrypt.compare(currentpassword,deep.password);
return compare;
}




const candidates=mongoose.model("candidates",schema);
export default candidates