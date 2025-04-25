import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia} from "../utils/cloudinary.js";
export const createCourse = async (req,res) => {
    try {
        const {courseTitle, category} = req.body;
        if(!courseTitle || !category) {
            return res.status(400).json({
                message:"Course title and category is required."
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator:req.id
        });

        return res.status(201).json({
            course,
            message:"Course created."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}

export const searchCourse = async (req,res) => {
    try {
        const {query = "", categories = [], sortByPrice =""} = req.query;
        console.log(categories);
        
        // create search query
        const searchCriteria = {
            isPublished:true,
            $or:[
                {courseTitle: {$regex:query, $options:"i"}},
                {subTitle: {$regex:query, $options:"i"}},
                {category: {$regex:query, $options:"i"}},
            ]
        }

        // if categories selected
        if(categories.length > 0) {
            searchCriteria.category = {$in: categories};
        }

        // define sorting order
        const sortOptions = {};
        if(sortByPrice === "low"){
            sortOptions.coursePrice = 1;//sort by price in ascending
        }else if(sortByPrice === "high"){
            sortOptions.coursePrice = -1; // descending
        }

        let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions);

        return res.status(200).json({
            success:true,
            courses: courses || []
        });

    } catch (error) {
        console.log(error);
        
    }
}

export const getPublishedCourse = async (_,res) => {
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"});
        if(!courses){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get published courses"
        })
    }
}
export const getCreatorCourses = async (req,res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({creator:userId});
        if(!courses){
            return res.status(404).json({
                courses:[],
                message:"Course not found"
            })
        };
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}

// controllers/course.controller.js




// import axios from 'axios';

// import { PDFDocument } from 'pdf-lib';
// const pdf = (await import('pdf-parse/lib/pdf-parse.js')).default;

// export const generateQuizFromCourseDoc = async (req, res) => {
//   try {
//     const { courseId } = req.params;
    
//     const course = await Course.findById(courseId);
//     if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
//     if (!course.courseDocument) return res.status(400).json({ success: false, message: 'No PDF document available' });

//     // Download and parse PDF
//     const response = await axios.get(course.courseDocument, { responseType: 'arraybuffer' });
    
//     const data = await pdf(response.data);
   
//     const limitedText = data.text.slice(0, 4000);
    
//     // Generate quiz
//     const openaiResponse = await axios.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         model: 'gpt-3.5-turbo',
//         messages: [{
//           role: 'system',
//           content: 'Generate 10 MCQs with 4 options each. Format: Q1. Question\nA) Opt1\nB) Opt2\nC) Opt3\nD) Opt4\n*Correct: B'
//         }, {
//           role: 'user',
//           content: `Text: ${limitedText}`
//         }],
//         temperature: 0.7,
//         max_tokens: 1500
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//         }
//       }
//     );

//     res.status(200).json({
//       success: true,
//       quiz: openaiResponse.data.choices[0].message.content
//     });

//   } catch (error) {
  
//     res.status(500).json({
//       success: false,
//       message: error.response?.status === 404 
//         ? 'PDF not found at URL' 
//         : 'OpenAI API rate limit exceeded. Please try again later.',
//       error: error.message
//     });
//   }
// };
// Required installs:
// npm install axios pdf-parse @langchain/community @langchain/core dotenv
// import { ChatOllama } from "@langchain/community/chat_models/ollama";

// const model = new ChatOllama({
//   baseUrl: "http://localhost:11434",
//   model: "llama3"
// });

// const res = await model.call("What is Node.js?");
// console.log(res);

// import axios from 'axios';
// const pdf = (await import('pdf-parse/lib/pdf-parse.js')).default;
// import { ChatOllama } from '@langchain/community/chat_models/ollama';
// import { HumanMessage } from '@langchain/core/messages';


// export const generateQuizFromCourseDoc = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const course = await Course.findById(courseId);

//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }

//     if (!course.courseDocument) {
//       return res.status(400).json({ success: false, message: 'No PDF document available' });
//     }

//     // Download and parse PDF
//     const response = await axios.get(course.courseDocument, { responseType: 'arraybuffer' });
//     const data = await pdf(response.data);

//     const limitedText = data.text.slice(0, 4000);

//     // Call Ollama to generate quiz
//     const model = new ChatOllama({
//         baseUrl: "http://localhost:11434",
//         model: "llama3"
//       });

//     const userPrompt = `Generate 10 multiple-choice questions based on this text:

// """
// ${limitedText}
// """

// Format:
// Q1. Question?
// A) Option1
// B) Option2
// C) Option3
// D) Option4
// *Correct: B`;

//     const responseMessage = await model.call([
//       new HumanMessage("what is react")
//     ]);

//     res.status(200).json({
//       success: true,
//       quiz: responseMessage.text
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Something went wrong.',
//     });
//   }
// };
import axios from 'axios';
import dotenv from 'dotenv';
const pdf = (await import('pdf-parse/lib/pdf-parse.js')).default;

dotenv.config();

export const generateQuizFromCourseDoc = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!course.courseDocument) {
      return res.status(400).json({ success: false, message: 'No PDF document available' });
    }

    // Download and parse PDF
    const respons = await axios.get(course.courseDocument, { responseType: 'arraybuffer' });
    const data = await pdf(respons.data);

    const limitedText = data.text.slice(0, 5000);
  

    // Step 3: Prepare prompt for LLaMA 3
    const prompt = `You are a quiz generator. 

Based on the following text, generate 10 multiple-choice questions (MCQs) with 4 options each.

Format each question exactly as follows:
**MCQ 1**
[Question text here]
A. [Option A text]
B. [Option B text]
C. [Option C text]
D. [Option D text]
Correct: [Letter of correct answer]

**MCQ 2**
[Question text here]
A. [Option A text]
B. [Option B text]
C. [Option C text]
D. [Option D text]
Correct: [Letter of correct answer]

And so on until MCQ 10. Make sure to maintain this exact format with the **MCQ number** header for each question, options listed as A, B, C, D, and the correct answer specified as "Correct: [Letter]".

Text to generate questions from:
${limitedText}`;

    // Step 4: Call Groq LLaMA 3 API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'You are an MCQ quiz generator.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    const quiz = response.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      quiz: quiz.trim()
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quiz',
      error: error.message
    });
  }
};

// Keep all your other controller methods...
export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
        const courseThumbnail = req.files;
        
        let course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message: "Course not found!"
            });
        }
        
        // Initialize update data object
        const updateData = {
            courseTitle, 
            subTitle, 
            description, 
            category, 
            courseLevel, 
            coursePrice
        };
        
        // Handle thumbnail upload if provided
        if(courseThumbnail) {
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); // delete old image
            }
            // upload a thumbnail on cloudinary
            const uploadedImage = await uploadMedia(req.files.courseThumbnail[0].path);
        
            updateData.courseThumbnail = uploadedImage?.secure_url;
        }
        
        // Handle document upload if provided
        // Note: You'll need to modify multer configuration to handle multiple files
        if(req.files && req.files.courseDocument) {
            if(course.courseDocument){
                const docPublicId = course.courseDocument.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(docPublicId); // delete old document
            }
            const uploadedDoc = await uploadMedia(req.files.courseDocument[0].path);
            updateData.courseDocument = uploadedDoc?.secure_url;
        }
 
        course = await Course.findByIdAndUpdate(courseId, updateData, {new: true});
        return res.status(200).json({
            course,
            message: "Course updated successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update course"
        });
    }
}


export const getCourseById = async (req,res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get course by id"
        })
    }
}

export const createLecture = async (req,res) => {
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"Lecture title is required"
            })
        };

        // create lecture
        const lecture = await Lecture.create({lectureTitle});

        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message:"Lecture created successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create lecture"
        })
    }
}

export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            lectures: course.lectures
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lectures"
        })
    }
}
export const editLecture = async (req,res) => {
    try {
        const {lectureTitle, videoInfo, isPreviewFree} = req.body;
        
        const {courseId, lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }

        // update lecture
        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        // Ensure the course still has the lecture id if it was not aleardy added;
        const course = await Course.findById(courseId);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save();
        };
        return res.status(200).json({
            lecture,
            message:"Lecture updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to edit lectures"
        })
    }
}
export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        // delete the lecture from couldinary as well
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // Remove the lecture reference from the associated course
        await Course.updateOne(
            {lectures:lectureId}, // find the course that contains the lecture
            {$pull:{lectures:lectureId}} // Remove the lectures id from the lectures array
        );

        return res.status(200).json({
            message:"Lecture removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture"
        })
    }
}
export const getLectureById = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lecture by id"
        })
    }
}


// publich unpublish course logic

export const togglePublishCourse = async (req,res) => {
    try {
        const {courseId} = req.params;
        const {publish} = req.query; // true, false
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            });
        }
        // publish status based on the query paramter
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message:`Course is ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
}