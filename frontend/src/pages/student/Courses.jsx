import { Skeleton } from "@/components/ui/skeleton";
import Course from "./Course";

const Courses = () => {
  const isLoading = false;
  const courses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-10 transition-colors">
          Explore Our <span className="text-blue-600 dark:text-blue-400">Courses</span>
        </h2>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => <CourseSkeleton key={index} />)
          ) : (
            courses.map((course, index) => <Course key={index} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl dark:shadow-gray-700 transition-shadow rounded-xl overflow-hidden">
      {/* Course Thumbnail Skeleton */}
      <Skeleton className="w-full h-44 bg-gray-200 dark:bg-gray-700" />
      
      <div className="px-6 py-5 space-y-4">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600" />
        
        {/* Instructor & Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
            <Skeleton className="h-5 w-24 bg-gray-300 dark:bg-gray-600" />
          </div>
          <Skeleton className="h-5 w-16 bg-gray-300 dark:bg-gray-600" />
        </div>
        
        {/* Course Duration */}
        <Skeleton className="h-4 w-1/3 bg-gray-300 dark:bg-gray-600" />
      </div>
    </div>
  );
};
