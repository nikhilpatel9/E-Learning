import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <h1 className="text-xl font-semibold text-gray-600 dark:text-gray-300">Loading...</h1>
      </div>
    );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Your Courses</h2>
        <Button className="flex items-center gap-2" onClick={() => navigate(`create`)}>
          <PlusCircle size={18} /> Create Course
        </Button>
      </div>
      <Table className="w-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <TableCaption className="text-gray-500 dark:text-gray-400">
          A list of your recent courses.
        </TableCaption>
        <TableHeader className="bg-gray-100 dark:bg-gray-800">
          <TableRow>
            <TableHead className="w-[120px] text-gray-700 dark:text-gray-300">Price</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Title</TableHead>
            <TableHead className="text-right text-gray-700 dark:text-gray-300">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.courses?.map((course) => (
            <TableRow key={course._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <TableCell className="font-medium text-gray-800 dark:text-gray-300">
                {course?.coursePrice || "NA"}
              </TableCell>
              <TableCell>
                <Badge className={
                  course.isPublished ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                }>
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-300">{course.courseTitle}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" onClick={() => navigate(`${course._id}`)}>
                  <Edit size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;