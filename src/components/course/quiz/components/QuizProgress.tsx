
import React from "react";

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

const QuizProgress: React.FC<QuizProgressProps> = ({ 
  currentQuestion, 
  totalQuestions 
}) => {
  return (
    <div className="text-sm text-gray-500">
      Question {currentQuestion + 1}/{totalQuestions}
    </div>
  );
};

export default QuizProgress;
