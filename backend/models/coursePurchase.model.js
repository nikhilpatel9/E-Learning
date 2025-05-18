import mongoose from "mongoose";
const coursePurchaseSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'completed', 'failed'],
        default:'pending'
    },
    paymentId:{
        type:String,
        required:true,
        unique: true
    }

},{timestamps:true});
export const CoursePurchase = mongoose.model('CoursePurchase', coursePurchaseSchema);