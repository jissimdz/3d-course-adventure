
import React from "react";
import { cn } from "@/lib/utils";
import { TextQuestion } from "../../types/quizTypes";

interface QuestionDisplayProps {
  question: TextQuestion;
  selectedOption: number | null;
  answerStatus: Record<number, 'correct' | 'wrong' | null>;
  flashEffect: number | null;
  onOptionSelect: (index: number) => void;
  buttonsDisabled: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedOption,
  answerStatus,
  flashEffect,
  onOptionSelect,
  buttonsDisabled,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{question.question}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <div
            key={index}
            onClick={() => !buttonsDisabled && onOptionSelect(index)}
            className={cn(
              "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-brand-blue",
              selectedOption === index ? "border-brand-blue" : "border-gray-200",
              {
                "bg-green-100 border-green-500": answerStatus[index] === 'correct',
                "bg-red-100 border-red-500": answerStatus[index] === 'wrong',
                "animate-pulse": flashEffect === index
              }
            )}
          >
            <span>{option.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;
