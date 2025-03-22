import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";

export default function EditCourse() {
  return (
    <div className="flex-1 p-6 rounded-lg shadow-md transition-colors bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-300 dark:border-gray-700">
        <h1 className="font-bold text-2xl">Add detailed information regarding the course</h1>
        <Link to="lecture">
          <Button className="px-4 py-2 rounded-lg shadow transition-colors bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-400">
            Go to Lectures Page
          </Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  );
}