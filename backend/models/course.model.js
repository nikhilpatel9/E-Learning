import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        required:true
    },
    subTitle: {type:String}, 
    description:{ type:String},
    category:{
        type:String,
        required:true
    },
    courseLevel:{
        type:String,
        enum:["Beginner", "Medium", "Advance"]
    },
    coursePrice:{
        type:Number
    },
    courseThumbnail:{
        type:String,
        default:"https://miro.medium.com/v2/resize:fit:1400/1*tt9EnHszPzpURR9mKRi8gA.jpeg"
    },
    courseDocument:{
        type:String
        
    },
    enrolledStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    lectures:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
        }
    ],
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isPublished:{
        type:Boolean,
        default:false
    }

}, {timestamps:true});

export const Course = mongoose.model("Course", courseSchema);