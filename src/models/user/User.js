const bycrpt = require('bcrypt');
const mongoose= require('mongoose')
const validator = require("validator");

const userSchema = new mongoose.Schema(
    
    {

    firstName:{
        type:String,
        required:[true,"firstname is required field"],
        minLength:4,
        maxLength:50

    },
    lastName:{
        type:String,
        
    },
    email:{
        type:String,
        required:[true,"email is required field"],
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,"password is required field"],
    },
    age:{
        type:Number,
        min:[18,'minimum age is 18'],
        max:[100,"maximum age is 100"]
    },
    gender:{
        type:String,
        validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }

      },
      photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
          if (!validator.isURL(value)) {
            throw new Error("Invalid Photo URL: " + value);
          }
        },
    },
    skills: {
        type: [String],
      },
      about: {
        type: String,
        default: "This is a default about of the user!",
      },
    }
},
{ timestamps: true }
)

userSchema.pre('save',async function (next){
   if(!this.isModified('password')){
     next()
   }

   const salt = await bycrpt.genSalt(10);
   this.password=await bycrpt.hash(this.password,salt)
   next() 
})






const User =mongoose.model("User",userSchema)

module.exports = User