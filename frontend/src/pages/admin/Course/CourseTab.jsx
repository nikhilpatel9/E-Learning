import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { FileText, Loader2, X, Upload, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
    courseDocument: null,
  });

  const params = useParams();
  const courseId = params.courseId;
  
  const { data: courseByIdData, isLoading: courseByIdLoading, refetch } =
    useGetCourseByIdQuery(courseId);

  // eslint-disable-next-line no-empty-pattern
  const [publishCourse, {}] = usePublishCourseMutation();
 
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState("");
  const [documentFileName, setDocumentFileName] = useState("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const navigate = useNavigate();

  // Initialize data from API response
  useEffect(() => {
    if (courseByIdData?.course) { 
      const course = courseByIdData?.course;
      
      setInput({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        description: course.description || "",
        category: course.category || "",
        courseLevel: course.courseLevel || "",
        coursePrice: course.coursePrice,
        courseThumbnail:"",
        courseDocument: null,
      });
      
      // If there's a thumbnail URL in the course data, set it as preview
      if (course.courseThumbnail) {
        setPreviewThumbnail(course.courseThumbnail);
      }
      
      // If there's a document URL
      if (course.documentUrl) {
        setDocumentPreviewUrl(course.documentUrl);
        setDocumentFileName(course.documentUrl.split('/').pop() || "Course Document");
      }
    }
  }, [courseByIdData]);

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to: ${value}`);
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const selectCategory = (value) => {
    setInput(prev => ({ ...prev, category: value }));
  };
  
  const selectCourseLevel = (value) => {
    setInput(prev => ({ ...prev, courseLevel: value }));
  };
  
  
    const selectThumbnail = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setInput({ ...input, courseThumbnail: file });
       
        const fileReader = new FileReader();
        fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
        fileReader.readAsDataURL(file);
      }
    };

  
  const selectDocument = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setInput(prev => ({ ...prev, courseDocument: file }));
      setDocumentFileName(file.name);
      const pdfUrl = URL.createObjectURL(file);
      setDocumentPreviewUrl(pdfUrl);
    } else if (file) {
      toast.error("Please upload a valid PDF file.");
    }
  };

  // Important function - fixed to properly handle thumbnail
  const updateCourseHandler = async () => {
    
    try {
      
      const formData = new FormData();
      
      // Append all the text fields
      formData.append("courseTitle", input.courseTitle);
      formData.append("subTitle", input.subTitle);
      formData.append("description", input.description);
      formData.append("category", input.category);
      formData.append("courseLevel", input.courseLevel);
      formData.append("coursePrice", input.coursePrice);     
      formData.append("courseThumbnail", input.courseThumbnail);
      
      if (input.courseDocument) {
        formData.append("courseDocument", input.courseDocument);
      }

      await editCourse({ formData, courseId });
      
      // IMPORTANT: Use the dynamic courseId in the navigation path
     // navigate(`/admin/course/${courseId}/lecture`);
    } catch (err) {
      console.error("Error updating course:", err);
      toast.error("An error occurred while updating the course.");
    }
  };
  const publishStatusHandler = async (action) => {
    try {
      console.log("Publishing status change for course ID:", courseId);
      const response = await publishCourse({courseId, query: action});
      if (response.data) {
        refetch();
        toast.success(response.data.message);
        navigate(`/admin/course/`);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error("Error changing publish status:", error);
      toast.error("Failed to publish or unpublish course");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course updated successfully.");
    }
    if (error) {
      const errorMsg = typeof error.data?.message === 'string' 
        ? error.data.message 
        : 'Failed to update course';
      console.error("API Error:", error);
      toast.error(errorMsg);
    }
  }, [isSuccess, error, data]);

  useEffect(() => {
    return () => {
      // Clean up any object URLs
      if (documentPreviewUrl && documentPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(documentPreviewUrl);
      }
    };
  }, [documentPreviewUrl]);

  if (courseByIdLoading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-gray-600 dark:text-gray-300" />
    </div>
  );
 
  return (
    <Card className="bg-white dark:bg-gray-900 shadow-lg">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle className="text-gray-800 dark:text-gray-200">Basic Course Information</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Make changes to your courses here. Click save when you&apos;re done.
          </CardDescription>
        </div>
        <div className="space-x-2 flex items-center">
          <Button 
            disabled={courseByIdData?.course?.lectures?.length === 0} 
            variant="outline" 
            onClick={() => publishStatusHandler(courseByIdData?.course?.isPublished ? "false" : "true")}
            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          >
            {courseByIdData?.course?.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Remove Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mt-5">
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack developer"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Category</Label>
              <Select
                key={`category-${input.category}`}
                value={input.category}
                onValueChange={selectCategory}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectGroup>
                    <SelectLabel className="text-gray-500 dark:text-gray-400">Category</SelectLabel>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="Next JS">Next JS</SelectItem>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="Data Science">Data Science</SelectItem>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="Frontend Development">Frontend Development</SelectItem>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="Fullstack Development">Fullstack Development</SelectItem>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="MERN Stack Development">MERN Stack Development</SelectItem>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="Javascript">Javascript</SelectItem>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="Python">Python</SelectItem>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="Docker">Docker</SelectItem>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="MongoDB">MongoDB</SelectItem>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectGroup>
                    <SelectLabel className="text-gray-500 dark:text-gray-400">Course Level</SelectLabel>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="Beginner">Beginner</SelectItem>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="Medium">Medium</SelectItem>
                    <SelectItem className="text-gray-800 dark:text-gray-200" value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Course Thumbnail</Label>
            <div className="mt-2 flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed rounded-lg cursor-pointer 
                border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    SVG, PNG, JPG or GIF
                  </p>
                </div>
                <Input
                  type="file"
                  onChange={selectThumbnail}
                  accept="image/*"
                  className="hidden"
                />
              </label>
              {previewThumbnail && (
                <div className="relative">
                  <img
                    src={previewThumbnail}
                    className="w-64 h-40 object-cover rounded-lg"
                    alt="Course Thumbnail"
                  />
                  
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced PDF section */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Course Document (PDF only)</Label>
            <div className="mt-2">
              {!documentPreviewUrl ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer 
                  border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-10 h-10 mb-3 text-gray-500 dark:text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload PDF</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Only PDF files are supported
                    </p>
                  </div>
                  <Input
                    type="file"
                    onChange={selectDocument}
                    accept=".pdf"
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-red-500 dark:text-red-400" />
                      <span className="font-medium truncate max-w-xs text-gray-800 dark:text-gray-300">{documentFileName}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowPdfPreview(!showPdfPreview)}
                        className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {showPdfPreview ? "Hide Preview" : "View PDF"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setDocumentPreviewUrl("");
                          setDocumentFileName("");
                          setInput({...input, courseDocument: null});
                        }}
                        className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {showPdfPreview && (
                    <div className="mt-3 border rounded-md overflow-hidden border-gray-300 dark:border-gray-600">
                      <iframe 
                        src={documentPreviewUrl} 
                        title="Document Preview"
                        className="w-full h-96 border-0"
                      ></iframe>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => navigate("/admin/course")} 
              variant="outline"
              className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button 
              disabled={isLoading} 
              onClick={updateCourseHandler}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;