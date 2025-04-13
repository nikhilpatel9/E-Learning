//import PdfQuizGenerator from "@/pages/generateQuiz";

import { useGetCourseByIdQuery } from "@/features/api/courseApi";
import PDFQuizGenerator from "@/pages/PDFQuizGenerator";

import { Loader2 } from "lucide-react"

import {  useParams } from "react-router-dom";
export default function CreateLecture() {
  const params = useParams();
  const courseId = params.courseId;
  const { data: courseByIdData, isLoading: courseByIdLoading, refetch } =
  useGetCourseByIdQuery(courseId);
   
  if (courseByIdLoading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-gray-600 dark:text-gray-300" />
    </div>
  );
  const course = courseByIdData?.course;
  if(!course){
    refetch();
  }
  return (
    <>
    <PDFQuizGenerator  course={course} 
      />
    
    </>
    
    //<div>CreateLecture</div>
  )
}
