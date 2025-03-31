import { Course } from "../models/course.model.js";
import {deleteMediaFromCloudinary, uploadMedia} from "../utils/cloudinary.js";
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




import axios from 'axios';

import { PDFDocument } from 'pdf-lib';
const pdf = (await import('pdf-parse/lib/pdf-parse.js')).default;

export const generateQuizFromCourseDoc = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (!course.courseDocument) return res.status(400).json({ success: false, message: 'No PDF document available' });

    // Download and parse PDF
    const response = await axios.get(course.courseDocument, { responseType: 'arraybuffer' });
    
    const data = await pdf(response.data);
   
    const limitedText = data.text.slice(0, 4000);
    
    // Generate quiz
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'Generate 10 MCQs with 4 options each. Format: Q1. Question\nA) Opt1\nB) Opt2\nC) Opt3\nD) Opt4\n*Correct: B'
        }, {
          role: 'user',
          content: `Text: ${limitedText}`
        }],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    res.status(200).json({
      success: true,
      quiz: openaiResponse.data.choices[0].message.content
    });

  } catch (error) {
  
    res.status(500).json({
      success: false,
      message: error.response?.status === 404 
        ? 'PDF not found at URL' 
        : 'OpenAI API rate limit exceeded. Please try again later.',
      error: error.message
    });
  }
};

// Keep all your other controller methods...
export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
        const thumbnail = req.file;
        
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
        if(thumbnail) {
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); // delete old image
            }
            // upload a thumbnail on cloudinary
            const uploadedImage = await uploadMedia(thumbnail.path);
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