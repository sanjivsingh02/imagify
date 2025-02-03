// import mongoose from "mongoose";
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'

// import users from "../models/userModel.js";


// const registerUser = async(req,res)=>{
// try {
//   const {name,email,password} = req.body;

//   if(!name || !email || !password ){
//     return res.json({sucess:false, message:"Missing detail"})
//   }

//   const salt = await bcrypt.genSalt(10)
//   const hashedPassword = await bcrypt.hash(password, salt)

// const userData = {
//   name,email,password:hashedPassword
// }

// const newUser = new users(userData)
// const user = await newUser.save()

// const token = jwt.sign({id:user._id},process.env.JWT_SECERET)
// res.json({sucess:true,token,user:{name:user.name}})

// } catch (error) {
//   console.log(error)
//   res.json({sucess:false, message: error.message})
// }
// }

// const loginUser = async(req,res)=>{
// try {
//   const {email,password} = req.body
//   const user = await users.findOne({email})

//   if(!user){
//     return res({sucess:false, message:'user does not exit'})
//   }

//   const isMatch = await bcrypt.compare(password, user.password)
//    if(isMatch){
//     const token = jwt.sign({id:user._id},process.env.JWT_SECRETE)
//     res.json({sucess:true,token,user:{name:user.name}})
//    }else{
//     return res({sucess:false, message: 'Invalid credential'})
//    }

// } catch (error) {
//   console.log(error)
//   res.json({sucess:false, message: error.message})
// }
// }

// export {registerUser,loginUser}

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Correct import
import razorpay from "razorpay"
import transactionModel from "../models/transactionData.js"
// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user object
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    // Save the user to the database
    const newUser = new User(userData);
    const user = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
     
    });

    // Send the response
    res.status(201).json({
      success: true,
      token,
      user: { name: user.name, email: user.email },
    });

  } catch (error) {
    console.error(error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email }); // Use the User model
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Send the response
    res.status(200).json({
      success: true,
      token,
      user: { name: user.name, email: user.email },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// const userCredit = async (req,res)=>{
//   try {
//     const {userId} =req.body
    
//     const user = await User.findById(userId)
//     res.json({sucess:true, credits: user.creditBalance,user:{name: user.name}})
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// }
const userCredit = async (req, res) => {
  try {
    const { userId } = req.body; // Ensure userId is being sent correctly
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, credits: user.creditBalance, user: { name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const razorpayInstance = new razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
})

const paymentRazorpay = async(req,res)=>{
  try {
    
    const {userId,planId} = req.body
    
    const userData = await User.findById(userId)

    if (!userId || !planId) {
      return res.json({success:false,message:"missing detail"})
    }

    let credits, plan, amount, date

    switch (planId) {
      case 'Basic':
        plan = 'Basic'
        credits = 100
        amount = 10
        break;

        case 'Advanced':
        plan = 'Advanced'
        credits = 500
        amount = 50
        break;

        case 'Business':
        plan = 'Business'
        credits = 5000
        amount = 250
        break;
    
      default:
        return res.json({success:false,message:"Plan not found"})
    }

    date = Date.now()

    const transactionData = {
      userId,plan, amount , credits, date
    }
 
    const newTrasaction = await transactionModel.create(transactionData)

    const options ={
      amount: amount * 100,
      currency:process.env.CURRENCY,
      receipt:newTrasaction._id,

    }

    await razorpayInstance.orders.create(options,(error,order)=>{
     
      if (error) {
        console.log(error)
        return res.json({success:false,message:error})
      }
    res.json({success:true,message:order})

    })



  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }
}


const verifyRazorpay = async(req,res)=>{
  try {
     const {razorpay_order_id}= req.body

     const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
     
     if (orderInfo.status === 'paid') {
      const transactionData = await transactionModel.findById(orderInfo.receipt)
      if (transactionData.payment) {
        return res.json({success:false,message:"payment failed"})
      }
    const userData = await User.findById(transactionData.userId)
    
    const creditBalance = userData.creditBalance + transactionData.credits
    await User.findByIdAndUpdate(userData._id,{creditBalance})
 
    await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true})
  
    res.json({success:true, message:'credits added'})
  }else{
    res.json({success:false,message:"paymentfail"})
  }
        

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

export { registerUser, loginUser,userCredit ,paymentRazorpay,verifyRazorpay};
