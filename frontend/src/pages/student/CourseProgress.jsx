import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import {
  CheckCircle,
  CheckCircle2,
  CirclePlay,
  Loader2,
  BookOpen,
  Award,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { 
    data, 
    isLoading, 
    isError, 
    refetch
  } = useGetCourseProgressQuery(courseId);

  const [updateLectureProgress, { isLoading: isUpdatingLecture }] = useUpdateLectureProgressMutation();
  const [completeCourse, { isLoading: isCompleting }] = useCompleteCourseMutation();
  const [inCompleteCourse, { isLoading: isInCompleting }] = useInCompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);

  useEffect(() => {
    if (!currentLecture && data?.data?.courseDetails?.lectures?.length > 0) {
      setCurrentLecture(data.data.courseDetails.lectures[0]);
    }
  }, [data, currentLecture]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load course data");
      navigate(`/course-detail/${courseId}`);
    }
  }, [isError, navigate, courseId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-lg font-medium">Loading course content...</span>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <div className="text-red-500 text-xl mb-4">No course data available</div>
        <Button onClick={refetch} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const { courseDetails, progress = [], completed = false } = data.data;
  const { courseTitle, lectures = [] } = courseDetails;

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleSelectLecture = async (lecture) => {
    if (!lecture || isUpdatingLecture) return;
    
    try {
      await updateLectureProgress({ 
        courseId, 
        lectureId: lecture._id 
      }).unwrap();
      setCurrentLecture(lecture);
    } catch (err) {
      console.error("Lecture progress update error:", err);
      toast.error("Failed to update lecture progress");
    }
  };

  const handleCompleteCourse = async () => {
    try {
      await completeCourse(courseId).unwrap();
      toast.success("Course marked as complete!");
    } catch (err) {
      console.error("Complete course error:", err);
      toast.error("Failed to mark course complete");
    }
  };

  const handleInCompleteCourse = async () => {
    try {
      await inCompleteCourse(courseId).unwrap();
      toast.success("Course marked as incomplete");
    } catch (err) {
      console.error("Incomplete course error:", err);
      toast.error("Failed to mark course incomplete");
    }
  };

  const completionPercentage =
    lectures.length > 0
      ? Math.round(
          (progress.filter((p) => p.viewed).length / lectures.length) * 100
        )
      : 0;
  return (
    <div className="max-w-7xl mx-auto p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Course Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {courseTitle}
              </h1>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course Progress
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          <Button
            onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
            className={`transition-all duration-300 ${
              completed
                ? "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                : "bg-primary hover:bg-primary/90"
            }`}
            size="lg"
            disabled={isCompleting || isInCompleting}
          >
            {(isCompleting || isInCompleting) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : completed ? (
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <span>Completed</span>
              </div>
            ) : (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Mark as Completed</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video section */}
        <div className="flex-1 lg:w-3/5 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {currentLecture?.videoUrl ? (
            <div className="aspect-video bg-black">
              <video
                src={currentLecture.videoUrl}
                controls
                className="w-full h-full object-contain"
                onPlay={() => handleSelectLecture(currentLecture)}
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                No video available for this lecture
              </p>
            </div>
          )}
          <div className="p-6">
            <h3 className="font-semibold text-xl text-gray-800 dark:text-white">
              {currentLecture 
                ? `Lecture ${lectures.findIndex((lec) => lec._id === currentLecture._id) + 1}: ${currentLecture.lectureTitle}`
                : "Select a lecture to begin"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {currentLecture?.description || "Select a lecture to view its content."}
            </p>
          </div>
        </div>

        {/* Lecture Sidebar */}
        <div className="w-full lg:w-2/5 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="font-semibold text-xl mb-6 text-gray-800 dark:text-white flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-primary" />
            Course Lectures
          </h2>

          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
            {lectures.length > 0 ? (
              lectures.map((lecture, index) => (
                <Card
                  key={lecture._id}
                  className={`border cursor-pointer ${
                    lecture._id === currentLecture?._id
                      ? "border-primary bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary"
                  } transition-colors duration-200`}
                  onClick={() => handleSelectLecture(lecture)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {isLectureCompleted(lecture._id) ? (
                          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle2 size={20} className="text-green-500 dark:text-green-400" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <CirclePlay size={20} className="text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Lecture {index + 1}
                        </div>
                        <CardTitle className="text-base font-medium text-gray-800 dark:text-white line-clamp-1">
                          {lecture.lectureTitle}
                        </CardTitle>
                      </div>
                    </div>
                    <Badge 
                      variant={isLectureCompleted(lecture._id) ? "success" : "secondary"}
                    >
                      {isLectureCompleted(lecture._id) ? "Completed" : "Pending"}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No lectures available for this course
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;