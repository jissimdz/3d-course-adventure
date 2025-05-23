
import React from "react";
import { cn } from "@/lib/utils";
import { ImageQuestion } from "../../types/quizTypes";

interface ImageQuestionDisplayProps {
  question: ImageQuestion;
  selectedOption: number | null;
  answerStatus: Record<number, 'correct' | 'wrong' | null>;
  flashEffect: number | null;
  onOptionSelect: (index: number) => void;
  buttonsDisabled: boolean;
}

const ImageQuestionDisplay: React.FC<ImageQuestionDisplayProps> = ({
  question,
  selectedOption,
  answerStatus,
  flashEffect,
  onOptionSelect,
  buttonsDisabled,
}) => {
  // Vérifier si la question et les options sont correctement chargées
  React.useEffect(() => {
    console.log("Question rendue:", question);
    console.log("Options disponibles:", question.options.length);
  }, [question]);

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{question.question}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <div
            key={index}
            onClick={() => !buttonsDisabled && onOptionSelect(index)}
            className={cn(
              "relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-brand-blue",
              selectedOption === index ? "border-brand-blue" : "border-gray-200",
              answerStatus[index] === 'correct' && "border-green-500 bg-green-50",
              answerStatus[index] === 'wrong' && "border-red-500 bg-red-50",
              flashEffect === index && "animate-pulse"
            )}
          >
            <img
              src={option.image}
              alt={option.alt || "Option d'image"}
              className="w-full h-auto rounded"
              onError={(e) => {
                console.error(`Erreur de chargement d'image:`, option.image);
                e.currentTarget.src = "https://via.placeholder.com/150?text=Image+non+disponible";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageQuestionDisplay;
