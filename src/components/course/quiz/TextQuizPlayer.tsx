
import React from "react";
import { TextQuestion } from "../types/quizTypes";
import { useQuizLogic } from "./hooks/useQuizLogic";
import QuestionDisplay from "./components/QuestionDisplay";
import QuizProgress from "./components/QuizProgress";
import QuizResult from "./components/QuizResult";

interface TextQuizPlayerProps {
  questions: TextQuestion[];
  onComplete?: (score: number, total: number) => void;
  courseId?: string;
}

const TextQuizPlayer: React.FC<TextQuizPlayerProps> = ({ 
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
  } = useQuizLogic({ questions, onComplete });

  // Afficher un message de débogage pour voir quel cours et quelles questions sont chargés
  React.useEffect(() => {
    if (courseId) {
      console.log(`TextQuizPlayer loaded for course: ${courseId}`);
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
          
          <QuestionDisplay 
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

export default TextQuizPlayer;
