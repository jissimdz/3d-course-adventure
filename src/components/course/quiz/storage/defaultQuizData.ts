
import { QuizSeries } from "../../types/quizTypes";

// Données de quiz par défaut - SEULEMENT utilisées si aucune donnée n'existe
export const defaultQuizData: Record<string, QuizSeries[]> = {
  "neuroanatomy": [
    {
      id: "default",
      name: "Quiz de Neuroanatomie - Aperçu de l'encéphale",
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
          question: "L'encéphale est composé de trois parties principales. Laquelle de ces combinaisons est correcte ?",
          options: [
            { text: "Moelle, cervelet, cortex", isCorrect: false },
            { text: "Cerveau, cervelet, tronc cérébral", isCorrect: true },
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
