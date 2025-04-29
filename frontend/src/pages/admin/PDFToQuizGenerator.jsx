import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";

// eslint-disable-next-line react/prop-types
const PDFToQuizGenerator = ({ quizText }) => {
  const [quizState, setQuizState] = useState({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    showResults: false,
    score: 0
  });

  useEffect(() => {
    if (quizText) {
      const parsedQuestions = parseQuizText(quizText);
      setQuizState({
        questions: parsedQuestions,
        currentQuestionIndex: 0,
        userAnswers: Array(parsedQuestions.length).fill(null),
        showResults: false,
        score: 0
      });
    }
  }, [quizText]);

  const parseQuizText = (text) => {
    // Split by MCQ markers
    const mcqBlocks = text.split(/\*\*MCQ \d+\*\*/);
    const questions = [];

    // Process each MCQ block (skip the first one as it's likely just introductory text)
    for (let i = 1; i < mcqBlocks.length; i++) {
      const block = mcqBlocks[i].trim();
      if (!block) continue;

      const lines = block.split('\n').filter(line => line.trim());
      if (lines.length < 5) continue; // Need at least question and 4 options

      // First line is the question
      const questionText = lines[0].trim();
      
      // Next 4 lines are options
      const options = [];
      for (let j = 1; j <= 4; j++) {
        if (lines[j]) {
          const optionMatch = lines[j].match(/^([A-D])\.\s+(.*)/);
          if (optionMatch) {
            options.push(optionMatch[2].trim());
          }
        }
      }

      // Find the correct answer line
      const correctLine = lines.find(line => line.toLowerCase().startsWith('correct:'));
      let correctAnswer = '';
      if (correctLine) {
        const answerMatch = correctLine.match(/Correct:\s*([A-D])/i);
        if (answerMatch) {
          correctAnswer = answerMatch[1].toUpperCase();
        }
      }

      if (questionText && options.length === 4 && correctAnswer) {
        questions.push({
          text: questionText,
          options,
          correctAnswer
        });
      }
    }

    return questions;
  };

  const handleAnswerSelect = (optionIndex) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = String.fromCharCode(65 + optionIndex) === currentQuestion.correctAnswer;

    const newUserAnswers = [...quizState.userAnswers];
    newUserAnswers[quizState.currentQuestionIndex] = optionIndex;

    setQuizState(prev => ({
      ...prev,
      userAnswers: newUserAnswers,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const handleNextQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1)
    }));
  };

  const handlePrevQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0)
    }));
  };

  const handleShowResults = () => {
    setQuizState(prev => ({ ...prev, showResults: true }));
  };

  const resetQuiz = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      userAnswers: Array(prev.questions.length).fill(null),
      showResults: false,
      score: 0
    }));
  };

  if (!quizText || quizState.questions.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-900 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-200">Quiz Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-gray-600 dark:text-gray-400">
            No quiz data available or quiz format not recognized.
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const totalQuestions = quizState.questions.length;
  const hasAnswered = quizState.userAnswers[quizState.currentQuestionIndex] !== null;

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-800 dark:text-gray-200">
          {quizState.showResults ? 'Quiz Results' : 'Generated Quiz'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {quizState.showResults ? (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Your Score: {quizState.score}/{totalQuestions}
              </h4>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                ({Math.round((quizState.score / totalQuestions) * 100)}%)
              </p>
            </div>

            <div className="space-y-4">
              {quizState.questions.map((question, qIndex) => {
                const userAnswerIndex = quizState.userAnswers[qIndex];
                const isCorrect = userAnswerIndex !== null &&
                  String.fromCharCode(65 + userAnswerIndex) === question.correctAnswer;

                return (
                  <div
                    key={qIndex}
                    className={`p-4 rounded-lg border ${isCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                      }`}
                  >
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      Q{qIndex + 1}: {question.text}
                    </p>
                    <div className="mt-2 space-y-2">
                      {question.options.map((option, oIndex) => {
                        const isSelected = userAnswerIndex === oIndex;
                        const isCorrectOption = String.fromCharCode(65 + oIndex) === question.correctAnswer;

                        return (
                          <div
                            key={oIndex}
                            className={`flex items-center p-2 rounded ${isSelected
                              ? isCorrectOption
                                ? 'bg-green-100 dark:bg-green-800/30'
                                : 'bg-red-100 dark:bg-red-800/30'
                              : isCorrectOption
                                ? 'bg-green-50 dark:bg-green-900/10'
                                : 'bg-gray-50 dark:bg-gray-800'
                              }`}
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + oIndex)})
                            </span>
                            <span>{option}</span>
                            {isSelected && (
                              <span className="ml-auto">
                                {isCorrect ? (
                                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                                )}
                              </span>
                            )}
                            {!isSelected && isCorrectOption && (
                              <span className="ml-auto">
                                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-center">
              <Button onClick={resetQuiz} variant="outline">
                Take Quiz Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                Question {quizState.currentQuestionIndex + 1} of {totalQuestions}
              </p>
              <h4 className="text-lg font-semibold mt-1 text-gray-800 dark:text-gray-200">
                {currentQuestion.text}
              </h4>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = quizState.userAnswers[quizState.currentQuestionIndex] === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={hasAnswered}
                    className={`w-full text-left p-3 rounded-md border transition-colors ${isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      } ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + index)})
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={quizState.currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              {quizState.currentQuestionIndex < totalQuestions - 1 ? (
                <Button
                  onClick={handleNextQuestion}
                  disabled={!hasAnswered}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleShowResults}
                  disabled={!hasAnswered}
                >
                  Show Results
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFToQuizGenerator;