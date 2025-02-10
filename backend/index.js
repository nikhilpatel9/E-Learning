import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/user.router.js';
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
  app.get('/api', (req, res) => {
    res.send('Hello World!')
    });
app.use("/api/user", userRoute);

app.listen(process.env.PORT||3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
  