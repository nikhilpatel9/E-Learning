/* eslint-disable no-constant-condition */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseByIdQuery } from "@/features/api/courseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();
  const { data: courseByIdData, isLoading: courseByIdLoading } = useGetCourseByIdQuery(courseId);

  const course = courseByIdData;

  if (courseByIdLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Course Top Section */}
      <div className="bg-[#1E293B] text-white">
        <div className="max-w-7xl mx-auto py-10 px-6 md:px-12 flex flex-col gap-4">
          <h1 className="font-bold text-3xl md:text-4xl">{course?.courseTitle}</h1>
          <p className="text-lg opacity-90">{course?.subTitle || "Course Subtitle"}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-300 mt-2">
            <span>
              Created by{" "}
              <span className="text-[#C0C4FC] underline italic">
                {course?.creator?.name || "Unknown"}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <BadgeInfo size={16} />
              <p>Last updated: {course?.createdAt?.split("T")[0]}</p>
            </div>
            <p>Students enrolled: {course?.enrolledStudents?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Course Details Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-10">
        {/* Left Side */}
        <div className="w-full lg:w-2/3 space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Description</h2>
            <div
              className="text-gray-700 leading-relaxed dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: course?.description }}
            />
          </div>

          {/* Course Content */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>{course?.lectures?.length || 0} lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course?.lectures?.length > 0 ? (
                course.lectures.map((lecture, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition"
                  >
                    <span>{true ? <PlayCircle size={16} /> : <Lock size={16} />}</span>
                    <p className="font-medium">{lecture.lectureTitle}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No lectures available yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/3">
          <Card className="shadow-lg">
            <CardContent className="p-4 flex flex-col space-y-4">
              {/* Video Player */}
              <div className="w-full aspect-video rounded-lg overflow-hidden mb-4">
                {course?.lectures?.length > 0 && course.lectures[0]?.videoUrl ? (
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    url={course.lectures[0].videoUrl}
                    controls
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500">No Preview Available</p>
                  </div>
                )}
              </div>

              {/* Lecture Title */}
              <h2 className="text-lg font-semibold">
                {course?.lectures?.length > 0 ? course.lectures[0]?.lectureTitle : "Lecture Title"}
              </h2>

              <Separator />

              {/* Course Price */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">₹{course?.coursePrice || "Free"}</h3>
              </div>
            </CardContent>

            {/* Buy Button */}
            <CardFooter className="flex justify-center">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
