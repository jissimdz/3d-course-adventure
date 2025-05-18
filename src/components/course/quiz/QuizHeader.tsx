
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Play } from "lucide-react";

interface QuizHeaderProps {
  onEditModeChange: () => void;
  courseId: string;
  onStartQuiz?: () => void;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ onEditModeChange, courseId, onStartQuiz }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-brand-blue">Quiz d'Évaluation</h2>
        <p className="mt-2 text-gray-600">Testez vos connaissances avec ce quiz interactif.</p>
      </div>
      <div className="flex gap-2">
        {onStartQuiz && (
          <Button
            onClick={onStartQuiz}
            className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
          >
            <Play className="h-4 w-4" />
            Commencer le Quiz
          </Button>
        )}
        <Button
          onClick={onEditModeChange}
          variant="outline"
          className="gap-2 text-brand-blue hover:bg-brand-blue/10"
        >
          <Edit2 className="h-4 w-4" />
          Éditer le Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizHeader;
