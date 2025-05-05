
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageQuestion } from "../types/quizTypes";

interface ImageQuizPlayerProps {
  questions: ImageQuestion[];
  onComplete?: (score: number, total: number) => void;
}

const ImageQuizPlayer: React.FC<ImageQuizPlayerProps> = ({ 
  questions, 
  onComplete 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Handle empty questions array
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune question disponible pour ce quiz.</p>
      </div>
    );
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null && questions[currentQuestion].options[selectedOption].isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsQuizCompleted(true);
      if (onComplete) {
        onComplete(score, questions.length);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="space-y-6 py-4">
      {!isQuizCompleted ? (
        <div className="space-y-6">
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">
              {questions[currentQuestion]?.question}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestion]?.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-brand-blue",
                    selectedOption === index ? "border-brand-blue" : "border-gray-200"
                  )}
                >
                  <img
                    src={option.image}
                    alt={option.alt}
                    className="w-full h-auto rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
            className="w-full bg-brand-blue hover:bg-brand-blue/90"
          >
            {currentQuestion === questions.length - 1 ? "Terminer" : "Question suivante"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-lg font-medium text-green-800">
              Score: {score} sur {questions.length}
            </p>
          </div>
          <Button
            onClick={resetQuiz}
            className="w-full"
            variant="outline"
          >
            Recommencer le Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageQuizPlayer;
