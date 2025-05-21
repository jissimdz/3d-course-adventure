
import React from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface QuizHeaderProps {
  onEditModeChange?: () => void;
  courseId?: string;
  onStartQuiz?: () => void;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  onStartQuiz,
  courseId
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-blue">Quiz: {courseId}</h2>
        <p className="text-gray-500">
          Évaluez vos connaissances avec ce quiz interactif.
        </p>
      </div>
      
      {onStartQuiz && (
        <Button 
          onClick={onStartQuiz}
          className="bg-brand-blue hover:bg-brand-blue/90"
        >
          <Play className="h-4 w-4 mr-2" />
          Commencer le Quiz
        </Button>
      )}
    </div>
  );
};

export default QuizHeader;
