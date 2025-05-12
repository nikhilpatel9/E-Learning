import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { 
   
  CalendarDays, 
  Clock, 
  Globe, 
  Lock, 
  PlayCircle, 
  Users 
} from "lucide-react";
import ReactPlayer from "react-player";
import { Link, useNavigate, useParams } from "react-router-dom";
import PDFQuizGenerator from "../admin/PDFQuizGenerator";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);
  
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-t-indigo-600 border-b-indigo-600 border-l-gray-200 border-r-gray-200 rounded-full animate-spin"></div>
        <h1 className="text-2xl font-semibold mt-6 text-gray-800 dark:text-gray-200">Loading your course...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <h1 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">Failed to load course details</h1>
          <p className="text-gray-600 dark:text-gray-300">Please try refreshing the page or return later.</p>
          <Button 
            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-16">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-10 px-6 md:px-12 flex flex-col gap-3">
          <div className="inline-flex items-center mb-1">
            <Link to="/courses" className="text-blue-200 hover:text-white mr-2 transition">
              Courses
            </Link>
            <span className="mx-2">›</span>
            <span className="text-blue-100">{course?.category || "Category"}</span>
          </div>
          
          <h1 className="font-bold text-2xl md:text-4xl mb-2 leading-tight">{course?.courseTitle}</h1>
          <p className="text-base md:text-lg opacity-90 font-light max-w-3xl">{course?.subTitle || "Master new skills with this comprehensive course"}</p>

          <div className="flex flex-wrap gap-4 text-sm mt-3 items-center">            
            <div className="flex items-center gap-2">
              <Users size={14} className="text-blue-200" />
              <p>
                <span className="font-medium">{course?.enrolledStudents?.length || 0}</span>
                <span className="text-blue-200 ml-1">students</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-blue-200" />
              <p>
                <span className="text-blue-200">Updated: </span>
                <span className="font-medium">{course?.createdAt?.split("T")[0]}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-blue-200">
                By{" "}
                <span className="text-white hover:underline transition cursor-pointer font-medium">
                  {course?.creator?.name || "Unknown"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Right Side (Video Card) - Moved to top on mobile */}
          <div className="w-full lg:w-1/3 order-1 lg:order-2">
            <Card className="shadow-xl border-0 overflow-hidden rounded-xl bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                {/* Video Player */}
                <div className="w-full aspect-video">
                  {course?.lectures?.length > 0 && course.lectures[0]?.videoUrl ? (
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      url={course.lectures[0].videoUrl}
                      controls
                      light={true}
                      playIcon={
                        <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 hover:bg-indigo-700 rounded-full transition cursor-pointer">
                          <PlayCircle size={36} className="text-white" />
                        </div>
                      }
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
                      <Globe size={48} className="text-gray-400" />
                      <p className="text-gray-500 mt-4">No Preview Available</p>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  {/* Lecture Title */}
                  <h2 className="text-xl font-semibold">
                    {course?.lectures?.length > 0 ? course.lectures[0]?.lectureTitle : "Preview Lecture"}
                  </h2>

                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={16} />
                    <span>{course?.lectures?.length || 0} lectures</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500">
                    <Globe size={16} />
                    <span>Full lifetime access • Mobile and desktop</span>
                  </div>

                  <Separator className="my-4" />

                  {/* Course Price */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-bold text-indigo-600">₹{course?.coursePrice || "Free"}</h3>
                  </div>

                  {/* Buy/Continue Button */}
                  <div className="pt-4">
                    {purchased ? (
                      <Button 
                        onClick={handleContinueCourse} 
                        className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-indigo-500/50 transition-all"
                      >
                        Continue Learning
                      </Button>
                    ) : (
                      <BuyCourseButton courseId={courseId} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Left Side (Course Info) */}
          <div className="w-full lg:w-2/3 order-2 lg:order-1 space-y-8 mt-8 lg:mt-16">
            {/* What You'll Learn */}
            <Card className="shadow-md border-0 rounded-xl bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">What You&apos;ll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Master the core concepts of this subject",
                    "Build professional-grade projects for your portfolio",
                    "Understand advanced techniques and methodologies",
                    "Learn industry best practices and standards"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="text-green-500 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="shadow-md border-0 rounded-xl bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Course Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-gray-700 dark:text-gray-300 leading-relaxed prose max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: course?.description }}
                />
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card className="shadow-md border-0 rounded-xl bg-white dark:bg-gray-800">
              <CardHeader className="border-b dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-semibold">Course Content</CardTitle>
                    <CardDescription className="mt-1">{course?.lectures?.length || 0} lectures</CardDescription>
                  </div>
                  <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                    Expand All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="divide-y dark:divide-gray-700">
                {course?.lectures?.length > 0 ? (
                  course.lectures.map((lecture, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 px-4 -mx-4 rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {purchased ? (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <PlayCircle size={20} className="text-indigo-600 dark:text-indigo-400" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Lock size={18} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{lecture.lectureTitle}</p>
                        <p className="text-sm text-gray-500">15:30 min</p>
                      </div>
                      {purchased && (
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                          Watch
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No lectures available yet.</p>
                  </div>
                )}
              </CardContent>          
            </Card>
            
            {/* Quiz Generator Card - Properly integrated into the layout */}
            {purchased && (
              <Card className="shadow-md border-0 rounded-xl bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">Generate Practice Quiz</CardTitle>
                  <CardDescription>Test your knowledge with a custom quiz based on course materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <PDFQuizGenerator courseId={courseId} />
                </CardContent>
              </Card>
            )}
          </div>         
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;