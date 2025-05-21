
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { shuffleArray } from "@/lib/utils";
import { TextQuestion } from "../types/quizTypes";

interface TextQuizPlayerProps {
  questions: TextQuestion[];
  onComplete?: (score: number, total: number) => void;
  courseId?: string;
}

const TextQuizPlayer: React.FC<TextQuizPlayerProps> = ({ 
  questions, 
  onComplete,
  courseId
}) => {
  // Create a shuffled copy of questions
  const [shuffledQuestions, setShuffledQuestions] = useState<TextQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<Record<number, 'correct' | 'wrong' | null>>({});
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [flashEffect, setFlashEffect] = useState<number | null>(null);
  
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with shuffled questions
  useEffect(() => {
    if (questions && questions.length > 0) {
      // Create a deep copy of the questions array with shuffled options
      const questionsWithShuffledOptions = questions.map(question => {
        // Create a deep copy of the question
        const questionCopy = { ...question };
        // Shuffle the options
        questionCopy.options = shuffleArray([...question.options]);
        return questionCopy;
      });
      
      // Then shuffle the order of questions
      setShuffledQuestions(shuffleArray(questionsWithShuffledOptions));
    }
  }, [questions]);

  // Afficher un message de débogage pour voir quel cours et quelles questions sont chargés
  useEffect(() => {
    if (courseId) {
      console.log(`TextQuizPlayer loaded for course: ${courseId}`);
      console.log(`Questions loaded: ${questions.length}`);
      console.log(`Questions shuffled: ${shuffledQuestions.length}`);
    }
  }, [courseId, questions, shuffledQuestions]);

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
      
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  // Handle empty questions array
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune question disponible pour ce quiz.</p>
      </div>
    );
  }

  // Wait for questions to be shuffled before rendering
  if (shuffledQuestions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Préparation des questions...</p>
      </div>
    );
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (buttonsDisabled) return; // Prevent selecting when buttons are disabled
    
    setSelectedOption(optionIndex);
    setButtonsDisabled(true); // Disable all buttons after selection
    
    // Play sound based on answer correctness
    const isCorrect = shuffledQuestions[currentQuestion].options[optionIndex].isCorrect;
    
    if (isCorrect) {
      setAnswerStatus({ ...answerStatus, [optionIndex]: 'correct' });
      setFlashEffect(optionIndex);
      if (correctSoundRef.current) {
        correctSoundRef.current.currentTime = 0; // Reset if already played
        correctSoundRef.current.play().catch(err => console.error("Error playing sound:", err));
      }
    } else {
      setAnswerStatus({ ...answerStatus, [optionIndex]: 'wrong' });
      setFlashEffect(optionIndex);
      if (wrongSoundRef.current) {
        wrongSoundRef.current.currentTime = 0; // Reset if already played
        wrongSoundRef.current.play().catch(err => console.error("Error playing sound:", err));
      }
    }
    
    // Auto advance to next question after delay
    autoAdvanceTimeoutRef.current = setTimeout(() => {
      handleNextQuestion();
    }, 1500); // 1.5 second delay before advancing
  };

  const handleNextQuestion = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    
    if (selectedOption !== null && shuffledQuestions[currentQuestion].options[selectedOption].isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setAnswerStatus({});
      setButtonsDisabled(false);
      setFlashEffect(null);
    } else {
      setIsQuizCompleted(true);
      if (onComplete) {
        onComplete(score, shuffledQuestions.length);
      }
    }
  };

  const resetQuiz = () => {
    // Reshuffle questions when quiz is reset
    if (questions && questions.length > 0) {
      const questionsWithShuffledOptions = questions.map(question => {
        const questionCopy = { ...question };
        questionCopy.options = shuffleArray([...question.options]);
        return questionCopy;
      });
      
      setShuffledQuestions(shuffleArray(questionsWithShuffledOptions));
    }
    
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setIsQuizCompleted(false);
    setAnswerStatus({});
    setButtonsDisabled(false);
    setFlashEffect(null);
  };

  // Clear flash effect after animation completes
  useEffect(() => {
    if (flashEffect !== null) {
      const timer = setTimeout(() => {
        setFlashEffect(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [flashEffect]);

  return (
    <div className="space-y-6 py-4">
      {!isQuizCompleted ? (
        <div className="space-y-6">
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1}/{shuffledQuestions.length}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">
              {shuffledQuestions[currentQuestion]?.question}
            </h3>
            
            <div className="space-y-3">
              {shuffledQuestions[currentQuestion]?.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-brand-blue",
                    selectedOption === index ? "border-brand-blue" : "border-gray-200",
                    {
                      "bg-green-100 border-green-500": answerStatus[index] === 'correct',
                      "bg-red-100 border-red-500": answerStatus[index] === 'wrong',
                      "animate-pulse": flashEffect === index
                    }
                  )}
                >
                  <span>{option.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-lg font-medium text-green-800">
              Score: {score} sur {shuffledQuestions.length}
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

export default TextQuizPlayer;
