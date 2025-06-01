import { QuizSeries } from "../types/quizTypes";
import { toast } from "sonner";

// Données de quiz par défaut - SEULEMENT utilisées si aucune donnée n'existe
const defaultQuizData = {
  "neuroanatomy": [
    {
      id: "default",
      name: "Quiz de Neuroanatomie - Tronc cérébral et Lobes",
      courseId: "neuroanatomy",
      imageQuestions: [],
      textQuestions: [
        {
          id: 1,
          question: "Quelle est la fonction principale du tronc cérébral ?",
          options: [
            { text: "Réguler les émotions et la mémoire", isCorrect: false },
            { text: "Contrôler les fonctions vitales comme la respiration", isCorrect: true },
            { text: "Coordonner les mouvements volontaires", isCorrect: false },
            { text: "Traiter l'information visuelle", isCorrect: false }
          ]
        },
        {
          id: 2,
          question: "Le tronc cérébral est composé de trois parties. Laquelle de ces combinaisons est correcte ?",
          options: [
            { text: "Moelle, cervelet, cortex", isCorrect: false },
            { text: "Bulbe, pont, mésencéphale", isCorrect: true },
            { text: "Thalamus, hippocampe, amygdale", isCorrect: false },
            { text: "Frontal, pariétal, temporal", isCorrect: false }
          ]
        },
        {
          id: 3,
          question: "Quelle est l'une des fonctions principales du cervelet ?",
          options: [
            { text: "Produire le langage", isCorrect: false },
            { text: "Réguler la température corporelle", isCorrect: false },
            { text: "Maintenir l'équilibre et la posture", isCorrect: true },
            { text: "Interpréter les émotions", isCorrect: false }
          ]
        },
        {
          id: 4,
          question: "Quel élément ne fait pas partie du diencéphale ?",
          options: [
            { text: "Hypothalamus", isCorrect: false },
            { text: "Thalamus", isCorrect: false },
            { text: "Mésencéphale", isCorrect: true },
            { text: "Épithalamus", isCorrect: false }
          ]
        },
        {
          id: 5,
          question: "Parmi ces fonctions, laquelle est liée au lobe frontal ?",
          options: [
            { text: "Contrôle des mouvements volontaires", isCorrect: true },
            { text: "Coordination motrice automatique", isCorrect: false },
            { text: "Traitement visuel", isCorrect: false },
            { text: "Réception des sensations tactiles", isCorrect: false }
          ]
        },
        {
          id: 6,
          question: "Quel rôle joue le lobe pariétal ?",
          options: [
            { text: "Interpréter les sons", isCorrect: false },
            { text: "Planifier les mouvements", isCorrect: false },
            { text: "Traiter les informations sensorielles tactiles", isCorrect: true },
            { text: "Contrôler la respiration", isCorrect: false }
          ]
        },
        {
          id: 7,
          question: "À quoi est principalement associé le lobe occipital ?",
          options: [
            { text: "La mémoire à long terme", isCorrect: false },
            { text: "La vision", isCorrect: true },
            { text: "La douleur", isCorrect: false },
            { text: "La régulation hormonale", isCorrect: false }
          ]
        },
        {
          id: 8,
          question: "Un accident vasculaire cérébral (AVC) dans le lobe pariétal peut provoquer :",
          options: [
            { text: "Une surdité", isCorrect: false },
            { text: "Des troubles de la mémoire", isCorrect: false },
            { text: "Une paralysie faciale", isCorrect: false },
            { text: "Des difficultés de lecture (alexie)", isCorrect: true }
          ]
        },
        {
          id: 9,
          question: "Quel rôle joue le lobe temporal ?",
          options: [
            { text: "Interpréter les sons", isCorrect: false },
            { text: "Traiter les informations auditives", isCorrect: true },
            { text: "Traiter la vision", isCorrect: false },
            { text: "Contrôler l'équilibre", isCorrect: false }
          ]
        },
        {
          id: 10,
          question: "Quelles sont les conséquences d'un AVC dans le lobe frontal ?",
          options: [
            { text: "Problèmes de prise de décision et de contrôle des mouvements", isCorrect: true },
            { text: "Trouble de l'équilibre", isCorrect: false },
            { text: "Problèmes de mémoire", isCorrect: false },
            { text: "Troubles de la vision", isCorrect: false }
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
    
    // PRIORITÉ ABSOLUE aux données sauvegardées
    if (savedSeries && savedSeries !== 'undefined' && savedSeries !== 'null') {
      try {
        const parsedSeries = JSON.parse(savedSeries);
        console.log(`Found saved quiz series for course: ${courseId}`, parsedSeries);
        
        // Vérifier que les données sont un tableau valide
        if (Array.isArray(parsedSeries)) {
          console.log(`Using saved quiz series with ${parsedSeries.length} series`);
          return parsedSeries; // TOUJOURS retourner les données sauvegardées, même si elles sont vides
        }
      } catch (parseError) {
        console.error(`Erreur de parsing pour quiz series:`, parseError);
      }
    }
    
    // SEULEMENT si aucune donnée sauvegardée valide n'existe, utiliser les données par défaut
    console.log(`No saved data found, using default data for ${courseId}`);
    const defaultSeries = defaultQuizData[courseId as keyof typeof defaultQuizData];
    
    if (defaultSeries) {
      console.log(`Using default data for ${courseId}:`, defaultSeries);
      return defaultSeries;
    }
    
    console.log(`No default data found for ${courseId}, returning empty array`);
    return [];
  } catch (error) {
    console.error(`Error loading quiz series from localStorage for course ${courseId}:`, error);
    return [];
  }
};

export const saveQuizSeries = (courseId: string, quizSeries: QuizSeries[]): boolean => {
  try {
    const storageKey = `quizSeries_${courseId}`;
    const serializedData = JSON.stringify(quizSeries);
    localStorage.setItem(storageKey, serializedData);
    console.log(`Successfully saved ${quizSeries.length} quiz series for course: ${courseId}`);
    console.log(`Saved data:`, quizSeries);
    return true;
  } catch (error) {
    console.error(`Error saving quiz series to localStorage for course ${courseId}:`, error);
    toast.error("Erreur lors de la sauvegarde des quiz");
    return false;
  }
};

export const createDefaultSeries = (courseId: string, initialImageQuestions = [], initialTextQuestions = []): QuizSeries => {
  // NE JAMAIS utiliser les données par défaut si des données existent déjà
  const existingData = loadQuizSeries(courseId);
  if (existingData.length > 0) {
    console.log("Existing data found, returning first series instead of creating new default");
    return existingData[0];
  }
  
  // Créer une série vide pour permettre à l'utilisateur d'ajouter ses propres questions
  const newSeries = {
    id: "default",
    name: `Quiz du cours ${courseId}`,
    courseId: courseId,
    imageQuestions: initialImageQuestions,
    textQuestions: initialTextQuestions
  };
  
  console.log("Created new default series:", newSeries);
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
