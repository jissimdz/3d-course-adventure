
// Fichier principal qui réexporte toutes les fonctionnalités de stockage
export { loadQuizSeries, saveQuizSeries, createDefaultSeries } from "./storage/quizStorageCore";
export { saveQuizProgress, getQuizProgress } from "./storage/quizProgressStorage";
export type { QuizProgress } from "./storage/quizProgressStorage";
