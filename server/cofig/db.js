// import mongoose from "mongoose";

// const connectDb = async()=>{

// mongoose.connection.on('connected',()=>{
//   console.log("database connected")
// })

//   await mongoose.connect(`${process.env.MONGODB_URI}/imagify`)
// }

// export default connectDb

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDB;