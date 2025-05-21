
import { QuizSeries } from "../types/quizTypes";
import { toast } from "sonner";

export const loadQuizSeries = (courseId: string): QuizSeries[] => {
  try {
    const storageKey = `quizSeries_${courseId}`;
    console.log(`Loading quiz series for course: ${courseId}`);
    const savedSeries = localStorage.getItem(storageKey);
    
    if (savedSeries && savedSeries !== 'undefined') {
      const parsedSeries = JSON.parse(savedSeries);
      console.log(`Loaded ${parsedSeries.length} quiz series for course: ${courseId}`);
      return parsedSeries;
    }
  } catch (error) {
    console.error(`Error loading quiz series from localStorage for course ${courseId}:`, error);
  }
  return [];
};

export const saveQuizSeries = (courseId: string, quizSeries: QuizSeries[]): boolean => {
  try {
    const storageKey = `quizSeries_${courseId}`;
    localStorage.setItem(storageKey, JSON.stringify(quizSeries));
    console.log(`Saved ${quizSeries.length} quiz series for course: ${courseId}`);
    return true;
  } catch (error) {
    console.error(`Error saving quiz series to localStorage for course ${courseId}:`, error);
    return false;
  }
};

export const createDefaultSeries = (courseId: string, initialImageQuestions = [], initialTextQuestions = []): QuizSeries => {
  return {
    id: "default",
    name: `Quiz du cours ${courseId}`,
    courseId: courseId,
    imageQuestions: initialImageQuestions,
    textQuestions: initialTextQuestions
  };
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
    console.log(`Saved quiz progress for course: ${courseId}, series: ${seriesId}`);
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
