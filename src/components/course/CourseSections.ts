
export interface CourseSection {
  id: number;
  title: string;
  duration: string;
  isPreview: boolean;
  videoUrl?: string;
  has3DModel?: boolean;
}

export const getNeuroanatomySections = (): CourseSection[] => [
  {
    id: 1,
    title: "Introduction à la Neuroanatomie",
    duration: "30 min",
    isPreview: true,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Structure et Organisation du Système Nerveux",
    duration: "45 min",
    isPreview: false,
  },
  {
    id: 3,
    title: "Exploration 3D du Cerveau",
    duration: "60 min",
    isPreview: true,
    has3DModel: true,
  },
  {
    id: 4,
    title: "Les Voies Neuronales et la Signalisation",
    duration: "50 min",
    isPreview: false,
  },
  {
    id: 5,
    title: "Neuroanatomie Clinique et Applications",
    duration: "45 min",
    isPreview: false,
  },
  {
    id: 6,
    title: "Évaluation et Pratique Interactive",
    duration: "40 min",
    isPreview: false,
  },
];

export const getGenericCourseSections = (courseTitle: string): CourseSection[] => [
  {
    id: 1,
    title: "Introduction au Cours",
    duration: "15 min",
    isPreview: true,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: `Concepts de Base en ${courseTitle}`,
    duration: "30 min",
    isPreview: false,
  },
  {
    id: 3,
    title: "Exploration 3D Interactive",
    duration: "45 min",
    isPreview: false,
  },
  {
    id: 4,
    title: "Structures et Fonctions Clés",
    duration: "60 min",
    isPreview: false,
  },
  {
    id: 5,
    title: "Quiz et Évaluation",
    duration: "20 min",
    isPreview: false,
  },
];

export const getLearningOutcomes = (isNeuroanatomyCourse: boolean, courseTitle?: string): string[] => {
  if (isNeuroanatomyCourse) {
    return [
      "Comprendre l'organisation structurelle complexe du cerveau et du système nerveux",
      "Maîtriser l'identification des structures cérébrales importantes via des modèles 3D interactifs",
      "Analyser les connexions entre les différentes régions du cerveau et leur rôle fonctionnel",
      "Explorer le système nerveux central et périphérique en détail",
      "Appliquer les connaissances en neuroanatomie à la compréhension des troubles neurologiques courants",
      "Développer une compréhension approfondie des voies neuronales et des mécanismes de signalisation"
    ];
  } else {
    return [
      `Comprendre les composants fondamentaux de ${courseTitle?.toLowerCase() || 'l\'anatomie'}`,
      "Naviguer et manipuler des modèles 3D pour explorer les structures anatomiques",
      `Identifier les éléments clés et leurs fonctions dans ${courseTitle?.toLowerCase() || 'l\'anatomie'}`,
      "Appliquer les connaissances à travers des quiz interactifs et des évaluations",
      "Établir des liens entre les structures anatomiques et leurs fonctions physiologiques",
    ];
  }
};
