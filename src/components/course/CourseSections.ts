
export interface CourseSection {
  id: number;
  title: string;
  duration: string;
  isPreview: boolean;
  videoUrl?: string;
  googleDriveId?: string;
  has3DModel?: boolean;
  quizId?: number;
}

export interface LearningOutcome {
  id: number;
  description: string;
}

export const getNeuroanatomySections = (): CourseSection[] => {
  return [
    {
      id: 1,
      title: "Introduction à la Neuroanatomie",
      duration: "15 min",
      isPreview: true,
      googleDriveId: "1D192QjWoOHRerEDG6P3LSkABrZo-Ih-H",
      quizId: 1,
    },
    {
      id: 2,
      title: "Structure du Cerveau",
      duration: "30 min",
      isPreview: false,
      has3DModel: true,
      quizId: 2,
    },
    {
      id: 3,
      title: "Système Nerveux Central",
      duration: "25 min",
      isPreview: false,
      quizId: 3,
    },
    {
      id: 4,
      title: "Système Nerveux Périphérique",
      duration: "20 min",
      isPreview: false,
      quizId: 4,
    },
    {
      id: 5,
      title: "Voies Neuronales",
      duration: "35 min",
      isPreview: false,
      has3DModel: true,
      quizId: 5,
    }
  ];
};

export const getGenericCourseSections = (courseName: string): CourseSection[] => {
  return [
    {
      id: 101,
      title: `Introduction à ${courseName}`,
      duration: "15 min",
      isPreview: true,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      quizId: 101,
    },
    {
      id: 102,
      title: "Fondamentaux",
      duration: "30 min",
      isPreview: false,
      quizId: 102,
    },
    {
      id: 103,
      title: "Techniques avancées",
      duration: "25 min",
      isPreview: false,
      quizId: 103,
    }
  ];
};

export const getLearningOutcomes = (isNeuroanatomyCourse: boolean, courseName: string): string[] => {
  if (isNeuroanatomyCourse) {
    return [
      "Identifier et localiser les principales structures du cerveau humain et du système nerveux",
      "Comprendre l'organisation fonctionnelle du système nerveux central et périphérique",
      "Analyser les voies neuronales et comprendre comment les signaux sont transmis dans le système nerveux",
      "Maîtriser la terminologie et les concepts fondamentaux de la neuroanatomie",
      "Visualiser et manipuler des modèles 3D du cerveau pour approfondir votre compréhension spatiale"
    ];
  } else {
    return [
      `Comprendre les principes fondamentaux de ${courseName}`,
      "Développer des compétences pratiques applicables dans un contexte professionnel",
      "Maîtriser la terminologie et les concepts clés du domaine",
      "Appliquer les connaissances acquises dans des situations réelles"
    ];
  }
};
