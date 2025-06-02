
import { QuizSeries } from "../../types/quizTypes";
import { toast } from "sonner";
import { defaultQuizData } from "./defaultQuizData";

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
    const defaultSeries = defaultQuizData[courseId];
    
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
