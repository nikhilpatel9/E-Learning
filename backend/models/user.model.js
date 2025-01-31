import mongoose from 'mongoose';

const UserSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
        },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','student'],
        default:'student'
    },
    enrolledCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }],
    photoUrl:{
        type:String,
        default:'default.jpg'
    },
})
export const  User = mongoose.model('User',UserSchema);