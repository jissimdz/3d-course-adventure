
import React, { createContext, useState, useContext, ReactNode } from "react";
import { ImageQuestion, TextQuestion } from "@/components/course/types/quizTypes";

// Sample quiz questions
const sampleQuestions: ImageQuestion[] = [
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
  }
];

// Quiz questions by section
const quizzesBySection: Record<number, ImageQuestion[]> = {
  1: [
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
    }
  ],
  2: [
    {
      id: 2,
      question: "Quelle image montre l'arachnoïde ?",
      options: [
        {
          image: "https://via.placeholder.com/150?text=Arachnoïde",
          alt: "Arachnoïde",
          isCorrect: true
        },
        {
          image: "https://via.placeholder.com/150?text=Dure-mère",
          alt: "Dure-mère",
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
    }
  ]
};

// Text quiz questions by section
const textQuizzesBySection: Record<number, TextQuestion[]> = {
  1: [
    {
      id: 1,
      question: "Quelle est la capitale de la France ?",
      options: [
        { text: "Paris", isCorrect: true },
        { text: "Lyon", isCorrect: false },
        { text: "Marseille", isCorrect: false },
        { text: "Bordeaux", isCorrect: false }
      ]
    }
  ],
  2: [
    {
      id: 2,
      question: "Quel est le plus grand organe du corps humain ?",
      options: [
        { text: "La peau", isCorrect: true },
        { text: "Le foie", isCorrect: false },
        { text: "Le cerveau", isCorrect: false },
        { text: "Les poumons", isCorrect: false }
      ]
    }
  ]
};

interface QuizContextType {
  activeQuizSection: number | null;
  activeQuizSeries: string;
  quizzesBySection: Record<number, ImageQuestion[]>;
  textQuizzesBySection: Record<number, TextQuestion[]>;
  setActiveQuizSection: (section: number | null) => void;
  setActiveQuizSeries: (series: string) => void;
  handleQuizStart: (sectionId: number, seriesId?: string) => void;
  handleQuizEdit: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeQuizSection, setActiveQuizSection] = useState<number | null>(null);
  const [activeQuizSeries, setActiveQuizSeries] = useState<string>("default");
  
  const handleQuizStart = (sectionId: number, seriesId: string = "default") => {
    setActiveQuizSection(sectionId);
    setActiveQuizSeries(seriesId);
  };

  const handleQuizEdit = () => {
    console.log("Quiz edit clicked");
  };
  
  return (
    <QuizContext.Provider value={{
      activeQuizSection,
      activeQuizSeries,
      quizzesBySection,
      textQuizzesBySection,
      setActiveQuizSection,
      setActiveQuizSeries,
      handleQuizStart,
      handleQuizEdit
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export { sampleQuestions };
