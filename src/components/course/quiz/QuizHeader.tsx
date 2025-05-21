
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pencil } from "lucide-react";

interface QuizHeaderProps {
  onEditModeChange?: () => void;
  courseId?: string;
  onStartQuiz?: () => void;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  onStartQuiz,
  courseId,
  onEditModeChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-blue">Quiz: {courseId}</h2>
        <p className="text-gray-500">
          Évaluez vos connaissances avec ce quiz interactif.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {onEditModeChange && (
          <Button 
            onClick={onEditModeChange}
            variant="outline"
            className="border-brand-blue text-brand-blue hover:bg-blue-50"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Éditer le Quiz
          </Button>
        )}
        
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
    </div>
  );
};

export default QuizHeader;
