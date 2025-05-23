
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
        },
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
        },
        {
          id: 2,
          question: "Quel neurotransmetteur est principalement associé à la maladie de Parkinson ?",
          options: [
            { text: "La dopamine", isCorrect: true },
            { text: "La sérotonine", isCorrect: false },
            { text: "L'acétylcholine", isCorrect: false },
            { text: "Le glutamate", isCorrect: false }
          ]
        },
        {
          id: 3,
          question: "Quelle structure fait partie du système nerveux central ?",
          options: [
            { text: "La moelle épinière", isCorrect: true },
            { text: "Le nerf sciatique", isCorrect: false },
            { text: "Le nerf facial", isCorrect: false },
            { text: "Le nerf vague", isCorrect: false }
          ]
        },
        {
          id: 4,
          question: "Combien de nerfs crâniens y a-t-il ?",
          options: [
            { text: "12", isCorrect: true },
            { text: "10", isCorrect: false },
            { text: "14", isCorrect: false },
            { text: "8", isCorrect: false }
          ]
        },
        {
          id: 5,
          question: "Quelle lobe du cerveau est responsable de la vision ?",
          options: [
            { text: "Lobe occipital", isCorrect: true },
            { text: "Lobe frontal", isCorrect: false },
            { text: "Lobe pariétal", isCorrect: false },
            { text: "Lobe temporal", isCorrect: false }
          ]
        },
        {
          id: 6,
          question: "Quelle est la fonction principale de l'hippocampe ?",
          options: [
            { text: "Mémoire", isCorrect: true },
            { text: "Vision", isCorrect: false },
            { text: "Audition", isCorrect: false },
            { text: "Équilibre", isCorrect: false }
          ]
        },
        {
          id: 7,
          question: "Quel est le plus gros nerf du corps humain ?",
          options: [
            { text: "Le nerf sciatique", isCorrect: true },
            { text: "Le nerf optique", isCorrect: false },
            { text: "Le nerf facial", isCorrect: false },
            { text: "Le nerf vague", isCorrect: false }
          ]
        },
        {
          id: 8,
          question: "Combien de segments a la moelle épinière ?",
          options: [
            { text: "31", isCorrect: true },
            { text: "24", isCorrect: false },
            { text: "33", isCorrect: false },
            { text: "28", isCorrect: false }
          ]
        },
        {
          id: 9,
          question: "Quelle structure connecte les deux hémisphères cérébraux ?",
          options: [
            { text: "Corps calleux", isCorrect: true },
            { text: "Thalamus", isCorrect: false },
            { text: "Hypothalamus", isCorrect: false },
            { text: "Cervelet", isCorrect: false }
          ]
        },
        {
          id: 10,
          question: "Quelle est la cellule principale du système nerveux ?",
          options: [
            { text: "Le neurone", isCorrect: true },
            { text: "La cellule gliale", isCorrect: false },
            { text: "L'astrocyte", isCorrect: false },
            { text: "L'oligodendrocyte", isCorrect: false }
          ]
        },
        {
          id: 11,
          question: "Quel lobe contrôle les fonctions exécutives ?",
          options: [
            { text: "Lobe frontal", isCorrect: true },
            { text: "Lobe pariétal", isCorrect: false },
            { text: "Lobe temporal", isCorrect: false },
            { text: "Lobe occipital", isCorrect: false }
          ]
        },
        {
          id: 12,
          question: "Quelle structure régule la température corporelle ?",
          options: [
            { text: "L'hypothalamus", isCorrect: true },
            { text: "Le thalamus", isCorrect: false },
            { text: "L'hypophyse", isCorrect: false },
            { text: "Le cervelet", isCorrect: false }
          ]
        },
        {
          id: 13,
          question: "Combien de paires de nerfs spinaux y a-t-il ?",
          options: [
            { text: "31", isCorrect: true },
            { text: "33", isCorrect: false },
            { text: "24", isCorrect: false },
            { text: "28", isCorrect: false }
          ]
        },
        {
          id: 14,
          question: "Quelle partie du cerveau contrôle l'équilibre ?",
          options: [
            { text: "Le cervelet", isCorrect: true },
            { text: "Le cortex moteur", isCorrect: false },
            { text: "Le thalamus", isCorrect: false },
            { text: "L'hypothalamus", isCorrect: false }
          ]
        },
        {
          id: 15,
          question: "Quel neurotransmetteur est associé au plaisir et à la récompense ?",
          options: [
            { text: "La dopamine", isCorrect: true },
            { text: "La sérotonine", isCorrect: false },
            { text: "L'acétylcholine", isCorrect: false },
            { text: "Le GABA", isCorrect: false }
          ]
        },
        {
          id: 16,
          question: "Quelle méninges est la plus externe ?",
          options: [
            { text: "La dure-mère", isCorrect: true },
            { text: "L'arachnoïde", isCorrect: false },
            { text: "La pie-mère", isCorrect: false },
            { text: "Aucune de ces réponses", isCorrect: false }
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
        
        // Vérifier que les données sont valides et non vides
        if (Array.isArray(parsedSeries) && parsedSeries.length > 0) {
          const hasQuestions = parsedSeries.some(series => 
            (series.imageQuestions && series.imageQuestions.length > 0) ||
            (series.textQuestions && series.textQuestions.length > 0)
          );
          
          if (hasQuestions) {
            return parsedSeries;
          }
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
    
    // Si même les données par défaut n'existent pas, retourner un tableau vide
    console.log(`Aucune donnée par défaut trouvée pour ${courseId}`);
    return [];
  } catch (error) {
    console.error(`Error loading quiz series from localStorage for course ${courseId}:`, error);
    return [];
  }
};

export const saveQuizSeries = (courseId: string, quizSeries: QuizSeries[]): boolean => {
  try {
    const storageKey = `quizSeries_${courseId}`;
    localStorage.setItem(storageKey, JSON.stringify(quizSeries));
    console.log(`Saved ${quizSeries.length} quiz series for course: ${courseId}`);
    return true;
  } catch (error) {
    console.error(`Error saving quiz series to localStorage for course ${courseId}:`, error);
    toast.error("Erreur lors de la sauvegarde des quiz");
    return false;
  }
};

export const createDefaultSeries = (courseId: string, initialImageQuestions = [], initialTextQuestions = []): QuizSeries => {
  // Utiliser les données par défaut si disponibles
  const defaultSeries = defaultQuizData[courseId as keyof typeof defaultQuizData];
  if (defaultSeries && defaultSeries.length > 0) {
    return defaultSeries[0];
  }
  
  // Sinon créer une série avec les questions fournies
  const newSeries = {
    id: "default",
    name: `Quiz du cours ${courseId}`,
    courseId: courseId,
    imageQuestions: initialImageQuestions,
    textQuestions: initialTextQuestions
  };
  
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
