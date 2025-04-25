import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/user.router.js';
import courseRoute from './routes/course.router.js';
import mediaRoute from './routes/media.router.js';
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
    origin:"http://localhost:5173",
    credentials:true
}));

app.use("/api/user", userRoute);
app.use("/api/course",courseRoute);
app.use("/api/media", mediaRoute);
app.listen(process.env.PORT||3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
  