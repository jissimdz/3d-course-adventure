
import { CourseProps } from "@/components/CourseCard";

export const courses: CourseProps[] = [
  {
    id: "human-anatomy-101",
    title: "Fondamentaux de l'Anatomie Humaine",
    description: "Explorez les structures et systèmes de base du corps humain avec des modèles 3D interactifs et des leçons complètes.",
    level: "Beginner",
    lessonCount: 12,
    duration: "6 heures",
    thumbnailUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "neuroanatomy",
    title: "Explorateur de Neuroanatomie",
    description: "Plongez au cœur des structures complexes du cerveau et du système nerveux avec des visualisations 3D détaillées.",
    level: "Intermediate",
    lessonCount: 10,
    duration: "8 heures",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cardiovascular-system",
    title: "Système Cardiovasculaire",
    description: "Comprenez les subtilités du cœur, des vaisseaux sanguins et du système circulatoire grâce à des modèles 3D interactifs.",
    level: "Intermediate",
    lessonCount: 8,
    duration: "5 heures",
    thumbnailUrl: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "skeletal-structure",
    title: "Structure & Fonction du Squelette",
    description: "Apprenez le système squelettique humain, la mécanique des articulations et les structures osseuses avec des modèles 3D détaillés.",
    level: "Beginner",
    lessonCount: 9,
    duration: "4.5 heures",
    thumbnailUrl: "https://images.unsplash.com/photo-1564732005956-20420ebdfe9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "advanced-pathology",
    title: "Études Avancées en Pathologie",
    description: "Examinez les conditions pathologiques et les maladies courantes grâce à des visualisations 3D interactives.",
    level: "Advanced",
    lessonCount: 14,
    duration: "10 heures",
    thumbnailUrl: "https://images.unsplash.com/photo-1576671414121-aa0c81714b9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "digestive-system",
    title: "Voyage dans le Système Digestif",
    description: "Suivez le parcours des aliments à travers le système digestif avec des visualisations 3D immersives et des explications détaillées.",
    level: "Beginner",
    lessonCount: 7,
    duration: "3.5 heures",
    thumbnailUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "neuroanatomy-advanced",
    title: "Neuroanatomie Avancée",
    description: "Découvrez les aspects complexes de la neuroanatomie avec des modèles 3D interactifs du cerveau et des structures neuronales.",
    level: "Advanced",
    lessonCount: 15,
    duration: "12 heures",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const getCourseById = (id: string) => {
  return courses.find(course => course.id === id);
};
