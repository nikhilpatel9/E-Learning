import PDFQuizGenerator from "@/pages/PDFQuizGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

export default function CreateLecture() {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  return (
    <>
      <PDFQuizGenerator courseId={courseId} />
      <div className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create a New Lecture
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add details for your new lecture below.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Lecture Title</Label>
              <Input
                type="text"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                placeholder="Enter lecture title"
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/course/${courseId}`)}
              >
                Back to Course
              </Button>
              <Button disabled={isLoading} onClick={createLectureHandler}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Create Lecture"
                )}
              </Button>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Existing Lectures
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              {lectureLoading ? (
                <p className="text-gray-600 dark:text-gray-300">Loading lectures...</p>
              ) : lectureError ? (
                <p className="text-red-500">Failed to load lectures.</p>
              ) : lectureData.lectures.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No lectures available.</p>
              ) : (
                <div className="space-y-4">
                  {lectureData.lectures.map((lecture, index) => (
                    <Lecture
                      key={lecture._id}
                      lecture={lecture}
                      courseId={courseId}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
