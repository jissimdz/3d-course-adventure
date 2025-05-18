
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { ImageQuestion, TextQuestion } from "@/components/course/types/quizTypes";
import { toast } from "sonner";

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

// Générer des questions spécifiques par cours
const generateQuizzesByCourse = (courseId: string): Record<number, ImageQuestion[]> => {
  switch (courseId) {
    case "neuroanatomy":
      return {
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
    case "human-anatomy-101":
      return {
        1: [
          {
            id: 1,
            question: "Quel os est le plus grand du corps humain ?",
            options: [
              {
                image: "https://via.placeholder.com/150?text=Fémur",
                alt: "Fémur",
                isCorrect: true
              },
              {
                image: "https://via.placeholder.com/150?text=Humérus",
                alt: "Humérus",
                isCorrect: false
              },
              {
                image: "https://via.placeholder.com/150?text=Tibia",
                alt: "Tibia",
                isCorrect: false
              },
              {
                image: "https://via.placeholder.com/150?text=Radius",
                alt: "Radius",
                isCorrect: false
              }
            ]
          }
        ]
      };
    case "cardiovascular-system":
      return {
        1: [
          {
            id: 1,
            question: "Quelle image montre une valve aortique ?",
            options: [
              {
                image: "https://via.placeholder.com/150?text=Valve_aortique",
                alt: "Valve aortique",
                isCorrect: true
              },
              {
                image: "https://via.placeholder.com/150?text=Valve_mitrale",
                alt: "Valve mitrale",
                isCorrect: false
              },
              {
                image: "https://via.placeholder.com/150?text=Valve_tricuspide",
                alt: "Valve tricuspide",
                isCorrect: false
              },
              {
                image: "https://via.placeholder.com/150?text=Valve_pulmonaire",
                alt: "Valve pulmonaire",
                isCorrect: false
              }
            ]
          }
        ]
      };
    default:
      return {
        1: [
          {
            id: 1,
            question: "Question par défaut",
            options: [
              {
                image: "https://via.placeholder.com/150?text=Option_A",
                alt: "Option A",
                isCorrect: true
              },
              {
                image: "https://via.placeholder.com/150?text=Option_B",
                alt: "Option B",
                isCorrect: false
              },
              {
                image: "https://via.placeholder.com/150?text=Option_C",
                alt: "Option C",
                isCorrect: false
              },
              {
                image: "https://via.placeholder.com/150?text=Option_D",
                alt: "Option D",
                isCorrect: false
              }
            ]
          }
        ]
      };
  }
};

// Générer des questions de texte spécifiques par cours
const generateTextQuizzesByCourse = (courseId: string): Record<number, TextQuestion[]> => {
  switch (courseId) {
    case "neuroanatomy":
      return {
        1: [
          {
            id: 1,
            question: "Quelle partie du cerveau est responsable de la coordination motrice ?",
            options: [
              { text: "Le cervelet", isCorrect: true },
              { text: "Le cortex préfrontal", isCorrect: false },
              { text: "L'hippocampe", isCorrect: false },
              { text: "Le thalamus", isCorrect: false }
            ]
          }
        ],
        2: [
          {
            id: 2,
            question: "Quel neurotransmetteur est principalement associé à la maladie de Parkinson ?",
            options: [
              { text: "La dopamine", isCorrect: true },
              { text: "La sérotonine", isCorrect: false },
              { text: "L'acétylcholine", isCorrect: false },
              { text: "Le glutamate", isCorrect: false }
            ]
          }
        ]
      };
    case "human-anatomy-101":
      return {
        1: [
          {
            id: 1,
            question: "Combien d'os compose le squelette humain adulte ?",
            options: [
              { text: "206", isCorrect: true },
              { text: "180", isCorrect: false },
              { text: "230", isCorrect: false },
              { text: "300", isCorrect: false }
            ]
          }
        ]
      };
    case "cardiovascular-system":
      return {
        1: [
          {
            id: 1,
            question: "Quelle est la fonction principale des valves cardiaques ?",
            options: [
              { text: "Empêcher le reflux sanguin", isCorrect: true },
              { text: "Oxygéner le sang", isCorrect: false },
              { text: "Produire des globules rouges", isCorrect: false },
              { text: "Réguler la pression artérielle", isCorrect: false }
            ]
          }
        ]
      };
    default:
      return {
        1: [
          {
            id: 1,
            question: "Question par défaut",
            options: [
              { text: "Réponse correcte", isCorrect: true },
              { text: "Réponse incorrecte 1", isCorrect: false },
              { text: "Réponse incorrecte 2", isCorrect: false },
              { text: "Réponse incorrecte 3", isCorrect: false }
            ]
          }
        ]
      };
  }
};

interface QuizContextType {
  activeQuizSection: number | null;
  activeQuizSeries: string;
  quizzesBySection: Record<number, ImageQuestion[]>;
  textQuizzesBySection: Record<number, TextQuestion[]>;
  courseId: string;
  setActiveQuizSection: (section: number | null) => void;
  setActiveQuizSeries: (series: string) => void;
  handleQuizStart: (sectionId: number, seriesId?: string) => void;
  handleQuizEdit: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
  courseId: string;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children, courseId }) => {
  const [activeQuizSection, setActiveQuizSection] = useState<number | null>(null);
  const [activeQuizSeries, setActiveQuizSeries] = useState<string>("default");
  const [quizzesBySection, setQuizzesBySection] = useState<Record<number, ImageQuestion[]>>({});
  const [textQuizzesBySection, setTextQuizzesBySection] = useState<Record<number, TextQuestion[]>>({});
  
  // Charger les questions spécifiques au cours au montage du composant
  useEffect(() => {
    if (courseId) {
      console.log(`Loading quizzes for course: ${courseId}`);
      
      const imageQuizzes = generateQuizzesByCourse(courseId);
      const textQuizzes = generateTextQuizzesByCourse(courseId);
      
      setQuizzesBySection(imageQuizzes);
      setTextQuizzesBySection(textQuizzes);
      setActiveQuizSeries("default"); // Réinitialiser la série active
      
      toast.info(`Quiz chargés pour le cours: ${courseId}`, {
        id: `quiz-loaded-${courseId}`,
        duration: 1500
      });
    }
  }, [courseId]);
  
  const handleQuizStart = (sectionId: number, seriesId: string = "default") => {
    console.log(`Starting quiz for section ${sectionId} with series ${seriesId} in course ${courseId}`);
    setActiveQuizSection(sectionId);
    setActiveQuizSeries(seriesId);
  };

  const handleQuizEdit = () => {
    console.log(`Quiz edit clicked for course ${courseId}`);
  };
  
  return (
    <QuizContext.Provider value={{
      activeQuizSection,
      activeQuizSeries,
      quizzesBySection,
      textQuizzesBySection,
      courseId,
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
