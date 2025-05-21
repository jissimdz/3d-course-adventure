
import { useState, useRef, useEffect } from "react";
import { ImageQuestion } from "../../types/quizTypes";
import { shuffleArray } from "@/lib/utils";

interface UseImageQuizLogicProps {
  questions: ImageQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export const useImageQuizLogic = ({ questions, onComplete }: UseImageQuizLogicProps) => {
  // Create a shuffled copy of questions
  const [shuffledQuestions, setShuffledQuestions] = useState<ImageQuestion[]>([]);
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

  // Initialize audio refs
  useEffect(() => {
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

  // Clear flash effect after animation completes
  useEffect(() => {
    if (flashEffect !== null) {
      const timer = setTimeout(() => {
        setFlashEffect(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [flashEffect]);

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

  return {
    shuffledQuestions,
    currentQuestion,
    selectedOption,
    score,
    isQuizCompleted,
    answerStatus,
    buttonsDisabled,
    flashEffect,
    handleOptionSelect,
    resetQuiz
  };
};
