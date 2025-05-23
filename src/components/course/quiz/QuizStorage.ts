
import { QuizSeries } from "../types/quizTypes";
import { toast } from "sonner";

// Données de quiz par défaut pour assurer qu'il y a toujours du contenu
const defaultQuizData = {
  "neuroanatomy": [
    {
      id: "default",
      name: "Quiz de Neuroanatomie",
      courseId: "neuroanatomy",
      imageQuestions: [
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
      textQuestions: [
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
      ]
    }
  ],
  "human-anatomy-101": [
    {
      id: "default",
      name: "Quiz d'Anatomie Humaine",
      courseId: "human-anatomy-101",
      imageQuestions: [
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
      ],
      textQuestions: [
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
    }
  ]
};

export const loadQuizSeries = (courseId: string): QuizSeries[] => {
  try {
    const storageKey = `quizSeries_${courseId}`;
    console.log(`Loading quiz series for course: ${courseId}`);
    const savedSeries = localStorage.getItem(storageKey);
    
    if (savedSeries && savedSeries !== 'undefined') {
      try {
        const parsedSeries = JSON.parse(savedSeries);
        console.log(`Loaded ${parsedSeries.length} quiz series for course: ${courseId}`);
        
        // Vérifier que les données sont valides
        if (Array.isArray(parsedSeries) && parsedSeries.length > 0) {
          return parsedSeries;
        }
      } catch (parseError) {
        console.error(`Erreur de parsing pour quiz series:`, parseError);
      }
    }
    
    // Si aucune donnée valide n'a été chargée, utiliser les données par défaut
    console.log(`Aucune série de quiz valide trouvée, utilisation des données par défaut`);
    const defaultSeries = defaultQuizData[courseId as keyof typeof defaultQuizData];
    
    if (defaultSeries) {
      console.log(`Données par défaut trouvées pour ${courseId}:`, defaultSeries);
      // Sauvegarder les données par défaut dans localStorage pour les utilisations futures
      try {
        localStorage.setItem(storageKey, JSON.stringify(defaultSeries));
      } catch (saveError) {
        console.error(`Erreur lors de la sauvegarde des données par défaut:`, saveError);
      }
      return defaultSeries;
    }
    
    // Si même les données par défaut n'existent pas, créer une série vide
    const emptySeries = [{
      id: "default",
      name: `Quiz du cours ${courseId}`,
      courseId: courseId,
      imageQuestions: [],
      textQuestions: []
    }];
    localStorage.setItem(storageKey, JSON.stringify(emptySeries));
    return emptySeries;
  } catch (error) {
    console.error(`Error loading quiz series from localStorage for course ${courseId}:`, error);
    return [];
  }
};

export const saveQuizSeries = (courseId: string, quizSeries: QuizSeries[]): boolean => {
  try {
    const storageKey = `quizSeries_${courseId}`;
    localStorage.setItem(storageKey, JSON.stringify(quizSeries));
    console.log(`Saved ${quizSeries.length} quiz series for course: ${courseId}`, quizSeries);
    return true;
  } catch (error) {
    console.error(`Error saving quiz series to localStorage for course ${courseId}:`, error);
    toast.error("Erreur lors de la sauvegarde des quiz");
    return false;
  }
};

export const createDefaultSeries = (courseId: string, initialImageQuestions = [], initialTextQuestions = []): QuizSeries => {
  const newSeries = {
    id: "default",
    name: `Quiz du cours ${courseId}`,
    courseId: courseId,
    imageQuestions: initialImageQuestions,
    textQuestions: initialTextQuestions
  };
  
  // Sauvegarder immédiatement la nouvelle série
  const existingSeries = loadQuizSeries(courseId);
  if (existingSeries.length === 0) {
    saveQuizSeries(courseId, [newSeries]);
  }
  
  return newSeries;
};

// Add the missing functions for quiz progress tracking
export interface QuizProgress {
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}

export const saveQuizProgress = (courseId: string, seriesId: string, progress: QuizProgress): void => {
  try {
    const storageKey = `quizProgress_${courseId}_${seriesId}`;
    localStorage.setItem(storageKey, JSON.stringify(progress));
    console.log(`Saved quiz progress for course: ${courseId}, series: ${seriesId}`, progress);
  } catch (error) {
    console.error(`Error saving quiz progress to localStorage:`, error);
  }
};

export const getQuizProgress = (courseId: string, seriesId: string): QuizProgress | null => {
  try {
    const storageKey = `quizProgress_${courseId}_${seriesId}`;
    const savedProgress = localStorage.getItem(storageKey);
    
    if (savedProgress && savedProgress !== 'undefined') {
      return JSON.parse(savedProgress);
    }
  } catch (error) {
    console.error(`Error loading quiz progress from localStorage:`, error);
  }
  return null;
};
