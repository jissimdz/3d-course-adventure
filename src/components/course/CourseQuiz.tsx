
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, X } from "lucide-react";
import { Label } from "@/components/ui/label";

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

const meningesQuestions = [
  {
    id: 1,
    question: "Quelle est la couche la plus externe des méninges ?",
    options: ["Dure-mère", "Arachnoïde", "Pie-mère"],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "Quelle méninge contient le liquide céphalo-rachidien ?",
    options: ["Dure-mère", "Espace sous-arachnoïdien", "Pie-mère"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Quelle est la méninge la plus proche du tissu cérébral ?",
    options: ["Dure-mère", "Arachnoïde", "Pie-mère"],
    correctAnswer: 2
  }
];

const CourseQuiz: React.FC<QuizSectionProps> = ({ questions = meningesQuestions, onEditClick }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

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

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setIsQuizOpen(false);
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

      <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
            Commencer le Quiz
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Quiz sur les méninges</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsQuizOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <p className="font-medium">
                  {index + 1}. {question.question}
                </p>
                <RadioGroup
                  value={selectedAnswers[question.id]?.toString()}
                  onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={optionIndex.toString()} id={`q${question.id}-${optionIndex}`} />
                      <Label htmlFor={`q${question.id}-${optionIndex}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            {!showResults ? (
              <Button
                onClick={() => setShowResults(true)}
                className="w-full bg-brand-blue hover:bg-brand-blue/90"
              >
                Valider les réponses
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <p className="text-lg font-medium text-green-800">
                    Score: {calculateScore()} sur {questions.length}
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseQuiz;
