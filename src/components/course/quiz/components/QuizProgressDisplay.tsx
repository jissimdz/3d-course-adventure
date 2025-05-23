
import React from "react";

interface QuizProgress {
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}

interface QuizProgressDisplayProps {
  progressData: QuizProgress | null;
  quizResult: { score: number; total: number } | null;
}

const QuizProgressDisplay: React.FC<QuizProgressDisplayProps> = ({
  progressData,
  quizResult
}) => {
  if (!progressData || quizResult) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
      <p className="text-sm text-green-800">
        Dernière tentative: {progressData.score} sur {progressData.total} ({progressData.percentage}%)
      </p>
      <p className="text-xs text-green-600">
        {new Date(progressData.completedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default QuizProgressDisplay;
