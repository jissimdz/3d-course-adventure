
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageQuestion {
  id: number;
  question: string;
  options: {
    image: string;
    alt: string;
    isCorrect: boolean;
  }[];
}

interface QuizSectionProps {
  questions?: ImageQuestion[];
  onEditClick: () => void;
}

const meningesQuestions: ImageQuestion[] = [
  {
    id: 1,
    question: "Quelle image représente la dure-mère ?",
    options: [
      {
        image: "https://via.placeholder.com/150?text=Dure-mère",
        alt: "Dure-mère",
        isCorrect: true
      },
      {
        image: "https://via.placeholder.com/150?text=Arachnoïde",
        alt: "Arachnoïde",
        isCorrect: false
      },
      {
        image: "https://via.placeholder.com/150?text=Pie-mère",
        alt: "Pie-mère",
        isCorrect: false
      },
      {
        image: "https://via.placeholder.com/150?text=Autre",
        alt: "Autre",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    question: "Quelle image montre le sinus sagittal supérieur ?",
    options: [
      {
        image: "https://via.placeholder.com/150?text=Option+1",
        alt: "Option 1",
        isCorrect: false
      },
      {
        image: "https://via.placeholder.com/150?text=Sinus",
        alt: "Sinus sagittal supérieur",
        isCorrect: true
      },
      {
        image: "https://via.placeholder.com/150?text=Option+3",
        alt: "Option 3",
        isCorrect: false
      },
      {
        image: "https://via.placeholder.com/150?text=Option+4",
        alt: "Option 4",
        isCorrect: false
      }
    ]
  }
];

const CourseQuiz: React.FC<QuizSectionProps> = ({ questions = meningesQuestions, onEditClick }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    // Update score if correct option was selected
    if (selectedOption !== null && questions[currentQuestion].options[selectedOption].isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setIsQuizCompleted(false);
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
        <DialogContent className="sm:max-w-[700px]">
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
            {!isQuizCompleted ? (
              <div className="space-y-6">
                <div className="text-sm text-gray-500">
                  Question {currentQuestion + 1}/{questions.length}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {questions[currentQuestion].question}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        className={cn(
                          "relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-brand-blue",
                          selectedOption === index ? "border-brand-blue" : "border-gray-200"
                        )}
                      >
                        <img
                          src={option.image}
                          alt={option.alt}
                          className="w-full h-auto rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedOption === null}
                  className="w-full bg-brand-blue hover:bg-brand-blue/90"
                >
                  {currentQuestion === questions.length - 1 ? "Terminer" : "Question suivante"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <p className="text-lg font-medium text-green-800">
                    Score: {score} sur {questions.length}
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
