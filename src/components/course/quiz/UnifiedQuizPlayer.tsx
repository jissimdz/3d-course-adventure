
import React, { useState, useEffect, useRef } from "react";
import { ImageQuestion, TextQuestion } from "../types/quizTypes";
import { shuffleArray } from "@/lib/utils";
import ImageQuestionDisplay from "./components/ImageQuestionDisplay";
import QuestionDisplay from "./components/QuestionDisplay";
import QuizProgress from "./components/QuizProgress";
import QuizResult from "./components/QuizResult";

interface UnifiedQuestion {
  id: string;
  type: 'image' | 'text';
  data: ImageQuestion | TextQuestion;
}

interface UnifiedQuizPlayerProps {
  imageQuestions: ImageQuestion[];
  textQuestions: TextQuestion[];
  onComplete?: (score: number, total: number) => void;
  courseId?: string;
}

const UnifiedQuizPlayer: React.FC<UnifiedQuizPlayerProps> = ({ 
  imageQuestions, 
  textQuestions,
  onComplete,
  courseId
}) => {
  const [unifiedQuestions, setUnifiedQuestions] = useState<UnifiedQuestion[]>([]);
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
      correctSoundRef.current = null;
      wrongSoundRef.current = null;
      
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  // Combine and shuffle questions
  useEffect(() => {
    if ((imageQuestions && imageQuestions.length > 0) || (textQuestions && textQuestions.length > 0)) {
      const combined: UnifiedQuestion[] = [];
      
      // Add image questions
      imageQuestions.forEach(question => {
        const questionWithShuffledOptions = { ...question };
        questionWithShuffledOptions.options = shuffleArray([...question.options]);
        combined.push({
          id: `image-${question.id}`,
          type: 'image',
          data: questionWithShuffledOptions
        });
      });
      
      // Add text questions  
      textQuestions.forEach(question => {
        const questionWithShuffledOptions = { ...question };
        questionWithShuffledOptions.options = shuffleArray([...question.options]);
        combined.push({
          id: `text-${question.id}`,
          type: 'text', 
          data: questionWithShuffledOptions
        });
      });
      
      // Shuffle the combined array
      setUnifiedQuestions(shuffleArray(combined));
    }
  }, [imageQuestions, textQuestions]);

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
    if (buttonsDisabled) return;
    
    setSelectedOption(optionIndex);
    setButtonsDisabled(true);
    
    // Check if answer is correct
    const currentQuestionData = unifiedQuestions[currentQuestion].data;
    const isCorrect = currentQuestionData.options[optionIndex].isCorrect;
    
    if (isCorrect) {
      setAnswerStatus({ ...answerStatus, [optionIndex]: 'correct' });
      setFlashEffect(optionIndex);
      if (correctSoundRef.current) {
        correctSoundRef.current.currentTime = 0;
        correctSoundRef.current.play().catch(err => console.error("Error playing sound:", err));
      }
    } else {
      setAnswerStatus({ ...answerStatus, [optionIndex]: 'wrong' });
      setFlashEffect(optionIndex);
      if (wrongSoundRef.current) {
        wrongSoundRef.current.currentTime = 0;
        wrongSoundRef.current.play().catch(err => console.error("Error playing sound:", err));
      }
    }
    
    // Auto advance to next question after delay
    autoAdvanceTimeoutRef.current = setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    
    if (selectedOption !== null && unifiedQuestions[currentQuestion].data.options[selectedOption].isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion < unifiedQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setAnswerStatus({});
      setButtonsDisabled(false);
      setFlashEffect(null);
    } else {
      setIsQuizCompleted(true);
      if (onComplete) {
        onComplete(score, unifiedQuestions.length);
      }
    }
  };

  const resetQuiz = () => {
    // Reshuffle questions when quiz is reset
    if ((imageQuestions && imageQuestions.length > 0) || (textQuestions && textQuestions.length > 0)) {
      const combined: UnifiedQuestion[] = [];
      
      imageQuestions.forEach(question => {
        const questionWithShuffledOptions = { ...question };
        questionWithShuffledOptions.options = shuffleArray([...question.options]);
        combined.push({
          id: `image-${question.id}`,
          type: 'image',
          data: questionWithShuffledOptions
        });
      });
      
      textQuestions.forEach(question => {
        const questionWithShuffledOptions = { ...question };
        questionWithShuffledOptions.options = shuffleArray([...question.options]);
        combined.push({
          id: `text-${question.id}`,
          type: 'text',
          data: questionWithShuffledOptions
        });
      });
      
      setUnifiedQuestions(shuffleArray(combined));
    }
    
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setIsQuizCompleted(false);
    setAnswerStatus({});
    setButtonsDisabled(false);
    setFlashEffect(null);
  };

  // Handle empty questions
  if (unifiedQuestions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune question disponible pour ce quiz.</p>
      </div>
    );
  }

  const currentQuestionData = unifiedQuestions[currentQuestion];

  return (
    <div className="space-y-6 py-4">
      {!isQuizCompleted ? (
        <div className="space-y-6">
          <QuizProgress 
            currentQuestion={currentQuestion} 
            totalQuestions={unifiedQuestions.length} 
          />
          
          {currentQuestionData.type === 'image' ? (
            <ImageQuestionDisplay
              question={currentQuestionData.data as ImageQuestion}
              selectedOption={selectedOption}
              answerStatus={answerStatus}
              flashEffect={flashEffect}
              onOptionSelect={handleOptionSelect}
              buttonsDisabled={buttonsDisabled}
            />
          ) : (
            <QuestionDisplay
              question={currentQuestionData.data as TextQuestion}
              selectedOption={selectedOption}
              answerStatus={answerStatus}
              flashEffect={flashEffect}
              onOptionSelect={handleOptionSelect}
              buttonsDisabled={buttonsDisabled}
            />
          )}
        </div>
      ) : (
        <QuizResult
          score={score}
          totalQuestions={unifiedQuestions.length}
          onReset={resetQuiz}
        />
      )}
    </div>
  );
};

export default UnifiedQuizPlayer;
