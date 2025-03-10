import express from "express";

import { createCourse, getCreatorCourses, searchCourse } from "../controllers/course.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();

router.route("/").post(isAuthenticated,createCourse);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/").get(isAuthenticated,getCreatorCourses);

export default router;