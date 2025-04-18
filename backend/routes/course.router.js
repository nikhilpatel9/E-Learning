import express from "express";
import upload from "../utils/multer.js";
import { createCourse, createLecture, editCourse, generateQuizFromCourseDoc, getCourseById, getCourseLecture, getCreatorCourses, searchCourse } from "../controllers/course.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();

router.route("/").post(isAuthenticated,createCourse);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/").get(isAuthenticated,getCreatorCourses);
router.route("/:courseId").put(isAuthenticated,
    upload.fields([
      { name: 'courseThumbnail', maxCount: 1 },
      { name: 'courseDocument', maxCount: 1 }
    ]),editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.post("/:courseId/generate-quiz",generateQuizFromCourseDoc);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
export default router;