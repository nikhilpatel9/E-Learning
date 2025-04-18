import { useGenerateQuizFromCourseDocMutation, useGetCourseByIdQuery } from '@/features/api/courseApi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Eye } from "lucide-react";
import { useState } from "react";
import PDFToQuizGenerator from '@/PDFToQuizGenerator';

// eslint-disable-next-line react/prop-types
const PDFQuizGenerator = ( {courseId} ) => {
  const [generateQuiz, { isLoading, error, data }] = useGenerateQuizFromCourseDocMutation();
  const [showResult, setShowResult] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const { data: courseByIdData, isLoading: courseByIdLoading } =
  useGetCourseByIdQuery(courseId);
  if (courseByIdLoading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-gray-600 dark:text-gray-300" />
    </div>
  );
  const course = courseByIdData?.course;
  
  const handleGenerate = async () => {
    try {
      await generateQuiz(course._id).unwrap();
      setShowResult(true);
    } catch (err) {
      console.error('Failed to generate quiz:', err);
    }
  };

  if (!course.courseDocument) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg shadow-sm">
        <p className="text-yellow-800 dark:text-yellow-400 font-medium flex items-center">
          <FileText className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-500" />
          No PDF document available for this course.
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-800 dark:text-gray-200">Course Document & Quiz Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* PDF Document Preview Section */}
          <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <FileText className="text-red-500 dark:text-red-400" />
                <span className="font-medium truncate max-w-xs text-gray-800 dark:text-gray-300">
                  Course Document
                </span>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowPdfPreview(!showPdfPreview)}
                className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                <Eye className="w-4 h-4 mr-1" />
                {showPdfPreview ? "Hide Preview" : "View PDF"}
              </Button>
            </div>
            
            {showPdfPreview && (
              <div className="mt-3 border rounded-md overflow-hidden border-gray-300 dark:border-gray-600">
                <iframe 
                  src={course.courseDocument} 
                  title="Document Preview"
                  className="w-full h-96 border-0"
                ></iframe>
              </div>
            )}
          </div>

          {/* Quiz Generation Section */}
          <div className="flex items-center">
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`${
                isLoading ? "bg-gray-400" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Quiz from PDF"
              )}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg shadow-sm">
              <p className="text-red-700 dark:text-red-400 font-medium">
                {error.data?.message || 'Failed to generate quiz'}
              </p>
            </div>
          )}

          {data?.quiz && showResult && (
                      <div className="mt-4 space-y-3">
                        {/* Replace the old quiz display with the new interactive component */}
                        <PDFToQuizGenerator quizText={data.quiz} />
                      </div>
                    )}
                  </div>
      </CardContent>
    </Card>
  );
};

export default PDFQuizGenerator;