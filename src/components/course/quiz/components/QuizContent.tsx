
import React from "react";
import { QuizSeries } from "../../types/quizTypes";
import UnifiedQuizPlayer from "../UnifiedQuizPlayer";

interface QuizContentProps {
  currentSeries: QuizSeries | undefined;
  courseId: string;
  onComplete: (score: number, total: number) => void;
}

const QuizContent: React.FC<QuizContentProps> = ({
  currentSeries,
  courseId,
  onComplete
}) => {
  const hasQuestions = currentSeries && 
                      ((currentSeries.imageQuestions && currentSeries.imageQuestions.length > 0) ||
                       (currentSeries.textQuestions && currentSeries.textQuestions.length > 0));

  if (!hasQuestions) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Aucune question disponible pour ce quiz.</p>
      </div>
    );
  }

  return (
    <UnifiedQuizPlayer 
      imageQuestions={currentSeries.imageQuestions || []}
      textQuestions={currentSeries.textQuestions || []}
      onComplete={onComplete}
      courseId={courseId}
    />
  );
};

export default QuizContent;
