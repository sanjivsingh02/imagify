// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './cofig/db.js'
// import userRouter from './routes/userRoute.js'
// import imageRouter from './routes/imageRoute.js'


// const PORT = process.env.PORT || 9090
// const app = express()

// //middleware 
// app.use(express.json())
// app.use(cors())
// await connectDB()

// app.use("/api/user",userRouter)
// app.use|("/api/image",imageRouter)
// app.get('/',(req,res)=> res.send("api working"))

// app.listen(PORT,()=>console.log(`server is running on ${PORT}`))

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './cofig/db.js';
import userRouter from './routes/userRoute.js';
import imageRouter from './routes/imageRoute.js';

const PORT = process.env.PORT || 9090;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to Database
await connectDB();

// Routes
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);
// app.use('api/user',userRouter)
// Test Route
app.get('/', (req, res) => res.send('API is working'));

// Start Server
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));