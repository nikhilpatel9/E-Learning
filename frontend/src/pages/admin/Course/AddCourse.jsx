import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  
  const [createCourse, { data, isLoading, error, isSuccess }] = useCreateCourseMutation();
  const navigate = useNavigate();

  const getSelectedCategory = (value) => setCategory(value);

  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created successfully.");
      navigate("/admin/course");
    }
  }, [isSuccess, error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add a New Course</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Fill in the details below to create a new course.
        </p>
        <div className="space-y-4">
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Title</Label>
            <Input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Enter Course Title"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Category</Label>
            <Select onValueChange={getSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700">
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="Next JS">Next JS</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                  <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
                  <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                  <SelectItem value="Javascript">Javascript</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Docker">Docker</SelectItem>
                  <SelectItem value="MongoDB">MongoDB</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/admin/course")}>Back</Button>
            <Button disabled={isLoading} onClick={createCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Course"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;