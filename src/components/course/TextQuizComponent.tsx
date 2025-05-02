
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TextQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

interface TextQuizComponentProps {
  questions: TextQuestion[];
  onComplete?: (score: number, total: number) => void;
}

const TextQuizComponent: React.FC<TextQuizComponentProps> = ({ 
  questions, 
  onComplete 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio refs
  React.useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    
    // Set volume to be subtle
    if (correctSoundRef.current) correctSoundRef.current.volume = 0.3;
    if (wrongSoundRef.current) wrongSoundRef.current.volume = 0.3;
    
    return () => {
      // Cleanup
      correctSoundRef.current = null;
      wrongSoundRef.current = null;
    };
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    // Play sound based on answer correctness
    const isCorrect = questions[currentQuestion]?.options[optionIndex]?.isCorrect;
    
    if (isCorrect && correctSoundRef.current) {
      correctSoundRef.current.play().catch(err => console.error("Error playing sound:", err));
    } else if (!isCorrect && wrongSoundRef.current) {
      wrongSoundRef.current.play().catch(err => console.error("Error playing sound:", err));
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null && questions[currentQuestion]?.options[selectedOption]?.isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsQuizCompleted(true);
      if (onComplete) {
        onComplete(score, questions.length);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setIsQuizCompleted(false);
  };

  // Handle case where there are no questions
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune question disponible pour ce quiz.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isQuizCompleted ? (
        <div className="space-y-6">
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">
              {questions[currentQuestion]?.question}
            </h3>
            
            <div className="space-y-3">
              {questions[currentQuestion]?.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleOptionSelect(index)}
                  className={cn(
                    "w-full justify-start text-left p-4 h-auto",
                    selectedOption === index 
                      ? "border-brand-blue ring-2 ring-brand-blue/20" 
                      : "border-gray-200"
                  )}
                >
                  {option.text}
                </Button>
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
  );
};

export default TextQuizComponent;
