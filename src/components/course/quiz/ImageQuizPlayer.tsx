
import React, { useEffect } from "react";
import { ImageQuestion } from "../types/quizTypes";
import { useImageQuizLogic } from "./hooks/useImageQuizLogic";
import ImageQuestionDisplay from "./components/ImageQuestionDisplay";
import QuizProgress from "./components/QuizProgress";
import QuizResult from "./components/QuizResult";

interface ImageQuizPlayerProps {
  questions: ImageQuestion[];
  onComplete?: (score: number, total: number) => void;
  courseId?: string;
}

const ImageQuizPlayer: React.FC<ImageQuizPlayerProps> = ({ 
  questions, 
  onComplete,
  courseId
}) => {
  const {
    shuffledQuestions,
    currentQuestion,
    selectedOption,
    score,
    isQuizCompleted,
    answerStatus,
    buttonsDisabled,
    flashEffect,
    handleOptionSelect,
    resetQuiz
  } = useImageQuizLogic({ questions, onComplete });

  // Afficher un message de débogage pour voir quel cours et quelles questions sont chargés
  useEffect(() => {
    if (courseId) {
      console.log(`ImageQuizPlayer loaded for course: ${courseId}`);
      console.log(`Questions loaded: ${questions.length}`);
      console.log(`Questions shuffled: ${shuffledQuestions.length}`);
    }
  }, [courseId, questions, shuffledQuestions]);

  // Handle empty questions array
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune question disponible pour ce quiz.</p>
      </div>
    );
  }

  // Wait for questions to be shuffled before rendering
  if (shuffledQuestions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Préparation des questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {!isQuizCompleted ? (
        <div className="space-y-6">
          <QuizProgress 
            currentQuestion={currentQuestion} 
            totalQuestions={shuffledQuestions.length} 
          />
          
          <ImageQuestionDisplay
            question={shuffledQuestions[currentQuestion]}
            selectedOption={selectedOption}
            answerStatus={answerStatus}
            flashEffect={flashEffect}
            onOptionSelect={handleOptionSelect}
            buttonsDisabled={buttonsDisabled}
          />
        </div>
      ) : (
        <QuizResult
          score={score}
          totalQuestions={shuffledQuestions.length}
          onReset={resetQuiz}
        />
      )}
    </div>
  );
};

export default ImageQuizPlayer;
