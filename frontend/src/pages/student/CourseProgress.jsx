/* eslint-disable no-unused-vars */
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
import ReactPlayer from "react-player";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

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
      await updateLectureProgress({ courseId, lectureId: lecture._id }).unwrap();
      setCurrentLecture(lecture);
       refetch()
    } catch (err) {
      toast.error("Failed to update lecture progress");
    }
  };

  const handleCompleteCourse = async () => {
    try {
      await completeCourse(courseId).unwrap();
      toast.success("Course marked as complete!");
       refetch()
    } catch (err) {
      toast.error("Failed to mark course complete");
    }
  };

  const handleInCompleteCourse = async () => {
    try {
      await inCompleteCourse(courseId).unwrap();
      toast.success("Course marked as incomplete");
       refetch()
    } catch (err) {
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
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {courseTitle}
              </h1>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course Progress
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3 dark:bg-gray-700">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          <Button
            onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
            className={`transition-all duration-300 px-6 py-3 text-white text-sm font-semibold rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              completed
                ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            }`}
            disabled={isCompleting || isInCompleting}
          >
            {(isCompleting || isInCompleting) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : completed ? (
              <>
                <Award className="mr-2 h-5 w-5" /> Completed
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" /> Mark as Completed
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
          {currentLecture?.videoUrl ? (
            <ReactPlayer
              url={currentLecture.videoUrl}
              controls
              width="100%"
              height="100%"
              onStart={() => handleSelectLecture(currentLecture)}
              className="rounded-xl overflow-hidden shadow-md"
            />
          ) : (
            <div className="aspect-video flex items-center justify-center text-gray-500 dark:text-gray-400">
              No video available for this lecture
            </div>
          )}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {currentLecture 
                ? `Lecture ${lectures.findIndex((lec) => lec._id === currentLecture._id) + 1}: ${currentLecture.lectureTitle}`
                : "Select a lecture to begin"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {currentLecture?.description || "Select a lecture to view its content."}
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/3 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-primary" /> Course Lectures
          </h2>
          <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
            {lectures.length > 0 ? (
              lectures.map((lecture, index) => (
                <Card
                  key={lecture._id}
                  className={`cursor-pointer border transition-all duration-200 rounded-xl shadow-sm hover:shadow-md ${
                    lecture._id === currentLecture?._id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                  }`}
                  onClick={() => handleSelectLecture(lecture)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <div
                        className={`h-8 w-8 flex items-center justify-center rounded-full mr-3 ${
                          isLectureCompleted(lecture._id)
                            ? "bg-green-200 dark:bg-green-800"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {isLectureCompleted(lecture._id) ? (
                          <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <CirclePlay size={18} className="text-gray-600 dark:text-gray-300" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Lecture {index + 1}
                        </div>
                        <CardTitle className="text-base font-medium text-gray-800 dark:text-white">
                          {lecture.lectureTitle}
                        </CardTitle>
                      </div>
                    </div>
                    <Badge variant={isLectureCompleted(lecture._id) ? "success" : "secondary"}>
                      {isLectureCompleted(lecture._id) ? "Completed" : "Pending"}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">
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