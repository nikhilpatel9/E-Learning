/* eslint-disable no-unused-vars */
import  { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import axios from "axios";


const PDFQuizGenerator = () => {
  const [pdfLink, setPdfLink] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractTextFromPDF = async (url) => {
    try {
      const response = await axios.post(
        "https://api.pdf.co/v1/pdf/convert/to/text",
        { url },
        { headers: { "x-api-key": import.meta.env.VITE_PDFCO_API_KEY } }
      );
      return response.data.body;
    } catch (err) {
      setError("Failed to extract text from PDF. Please check the link.");
      return "";
    }
  };
  
  const generateQuiz = async (text) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "gpt-4",
          prompt: `Generate a 10-question multiple-choice quiz from the following text:\n${text}\nEach question should have 4 answer options, with one correct answer indicated. Return the quiz in JSON format.`,
          max_tokens: 500,
          temperature: 0.7,
          n: 1,
        },
        {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}` },
        }
      );
      return JSON.parse(response.data.choices[0].text);
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
      return [];
    }
  };

  const handlePDFUpload = async () => {
    if (!pdfLink) return;
    setIsLoading(true);
    setError(null);
    
    const extractedText = await extractTextFromPDF(pdfLink);
    if (!extractedText) {
      setIsLoading(false);
      return;
    }
    
    const generatedQuiz = await generateQuiz(extractedText);
    setQuiz(generatedQuiz);
    setIsLoading(false);
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitQuiz = () => {
    let correctCount = 0;
    quiz.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) correctCount++;
    });
    setScore(correctCount);
    setQuizSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>PDF Quiz Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input 
              type="text" 
              placeholder="Enter PDF download link" 
              value={pdfLink}
              onChange={(e) => setPdfLink(e.target.value)}
              className="mb-2"
            />
            <Button 
              onClick={handlePDFUpload} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Generate Quiz from PDF'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="text-center text-gray-500">
              Extracting text and generating quiz... Please wait.
            </div>
          )}

          {quiz.length > 0 && (
            <div>
              {quiz.map((q) => (
                <div key={q.id} className="mb-4 p-3 border rounded">
                  <p className="font-semibold mb-2">{q.question}</p>
                  {q.options.map((option, index) => (
                    <div 
                      key={index} 
                      onClick={() => handleAnswerSelect(q.id, index)}
                      className={`p-2 border rounded mb-1 cursor-pointer 
                        ${quizSubmitted 
                          ? (index === q.correctAnswer 
                            ? 'bg-green-100' 
                            : userAnswers[q.id] === index 
                              ? 'bg-red-100' 
                              : '')
                          : (userAnswers[q.id] === index 
                            ? 'bg-blue-100' 
                            : 'hover:bg-gray-100')
                        }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              ))}

              <Button 
                onClick={submitQuiz} 
                disabled={Object.keys(userAnswers).length !== quiz.length}
                className="w-full mt-4"
              >
                Submit Quiz
              </Button>

              {quizSubmitted && (
                <Alert className="mt-4">
                  <AlertTitle>Quiz Results</AlertTitle>
                  <AlertDescription>
                    You scored {score} out of {quiz.length}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFQuizGenerator;
