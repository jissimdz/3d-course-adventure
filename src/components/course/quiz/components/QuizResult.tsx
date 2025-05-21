
import React from "react";
import { Button } from "@/components/ui/button";

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  onReset: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({
  score,
  totalQuestions,
  onReset
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-green-50 p-4 text-center">
        <p className="text-lg font-medium text-green-800">
          Score: {score} sur {totalQuestions}
        </p>
      </div>
      <Button
        onClick={onReset}
        className="w-full"
        variant="outline"
      >
        Recommencer le Quiz
      </Button>
    </div>
  );
};

export default QuizResult;
