import mongoose from "mongoose";

// Define the user schema
const transactionSchema = new mongoose.Schema({
  userId :{
    type:String,
    required:true

  },
  plan:{
    type:String,
    required:true
  },
  amount:{
    type:Number,
    required:true
  },
  credits:{
    type:Number,
    required:true
  },
  payment:{
    type:Boolean,
    default:false
  },
  date:{
    type:Number
  }
});

// Check if the model already exists to avoid recompiling it
const transactionModel = mongoose.models.transaction || mongoose.model("transaction", transactionSchema);

// Export the User model
export default transactionModel;