import express from "express";
import upload from "../utils/multer.js";
import { createCourse, editCourse, getCourseById, getCreatorCourses, searchCourse } from "../controllers/course.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();

router.route("/").post(isAuthenticated,createCourse);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/").get(isAuthenticated,getCreatorCourses);
router.route("/:courseId").put(
    isAuthenticated,
    upload.fields([
      { name: 'courseThumbnail', maxCount: 1 },
      { name: 'courseDocument', maxCount: 1 }
    ]),
    editCourse
  );
router.route("/:courseId").get(isAuthenticated, getCourseById);
export default router;