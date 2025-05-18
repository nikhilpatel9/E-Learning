/* eslint-disable react/prop-types */
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition duration-300 p-4 flex flex-col md:flex-row items-start md:items-center gap-6 border border-gray-200 dark:border-gray-800">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full"
      >
        <img
          src={course.courseThumbnail}
          alt="course-thumbnail"
          className="h-40 w-full md:w-60 object-cover rounded-md"
        />

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {course.courseTitle}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {course.subTitle}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Instructor:{" "}
              <span className="font-semibold">{course.creator?.name}</span>
            </p>
          </div>

          <div className="mt-2">
            <Badge className="w-fit text-sm">{course.courseLevel}</Badge>
          </div>
        </div>
      </Link>

      <div className="md:text-right w-full md:w-auto">
        <h2 className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
          ${course.coursePrice}
        </h2>
      </div>
    </div>
  );
};

export default SearchResult;
