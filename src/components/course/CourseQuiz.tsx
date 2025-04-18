
import React from "react";
import { Check, HelpCircle, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizSectionProps {
  questions: Question[];
  onEditClick: () => void;
}

const CourseQuiz: React.FC<QuizSectionProps> = ({ questions, onEditClick }) => {
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});
  const [showResults, setShowResults] = React.useState(false);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand-blue">Quiz d'Évaluation</h2>
          <p className="mt-2 text-gray-600">Testez vos connaissances avec ce quiz interactif.</p>
        </div>
        <Button
          onClick={onEditClick}
          variant="outline"
          className="gap-2 text-brand-blue hover:bg-brand-blue/10"
        >
          <Edit2 className="h-4 w-4" />
          Éditer le Quiz
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="p-4">
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-medium">{question.question}</h3>
                </div>
                <HelpCircle className="h-5 w-5 text-gray-400" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswerSelect(question.id, optionIndex)}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${
                        selectedAnswers[question.id] === optionIndex
                          ? "border-brand-blue bg-brand-blue/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {questions.length > 0 && (
        <Button
          onClick={() => setShowResults(true)}
          className="w-full bg-brand-blue hover:bg-brand-blue/90"
        >
          Vérifier les Réponses
        </Button>
      )}

      {showResults && (
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <p className="text-lg font-medium text-green-800">
            Score: {calculateScore()} sur {questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseQuiz;
