import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/user.router.js';
import courseRoute from './routes/course.router.js';
import mediaRoute from './routes/media.router.js';
import purchaseRoute from "./routes/coursePurchase.router.js";
import courseProgressRoute from "./routes/courseProgress.router.js";
import path from 'path'
const _dirname = path.resolve()
dotenv.config();
const app = express();
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin:"https://e-learning-mbha.onrender.com/",
    credentials:true
}));

app.use("/api/user", userRoute);
app.use("/api/course",courseRoute);
app.use("/api/media", mediaRoute);
app.use("/api/purchase",purchaseRoute);
app.use("/api/progress", courseProgressRoute);
app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})
app.listen(process.env.PORT||3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
  