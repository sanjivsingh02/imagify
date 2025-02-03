// import mongoose from "mongoose";


// const userSchema = new mongoose.Schema({
//   name:{
//     type:String,
//     required:true
//   },
//   email:{
//     type:String,
//     required:true,
//     unique:true
//   },
//   password:{
//     type:String,
//     required:true
//   },
//   creditBalance:{type:Number, default:5}
// })

// //const users= mongoose.models.user || mongoose.model("user",userSchema)
// const users = mongoose.models.User || mongoose.model("User", userSchema);
// export default users

import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
  },
  password: {
    type: String,
    required: true,
  },
  creditBalance: {
    type: Number,
    default: 5, // Default credit balance
  },
});

// Check if the model already exists to avoid recompiling it
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Export the User model
export default User;