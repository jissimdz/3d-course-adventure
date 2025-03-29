
import { CourseProps } from "@/components/CourseCard";

export const courses: CourseProps[] = [
  {
    id: "human-anatomy-101",
    title: "Human Anatomy Fundamentals",
    description: "Explore the basic structures and systems of the human body with interactive 3D models and comprehensive lessons.",
    level: "Beginner",
    lessonCount: 12,
    duration: "6 hours",
    thumbnailUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "neuroanatomy",
    title: "Neuroanatomy Explorer",
    description: "Dive deep into the complex structures of the brain and nervous system with detailed 3D visualizations.",
    level: "Intermediate",
    lessonCount: 10,
    duration: "8 hours",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cardiovascular-system",
    title: "Cardiovascular System",
    description: "Understand the intricacies of the heart, blood vessels, and circulatory system through interactive 3D models.",
    level: "Intermediate",
    lessonCount: 8,
    duration: "5 hours",
    thumbnailUrl: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "skeletal-structure",
    title: "Skeletal Structure & Function",
    description: "Learn about the human skeletal system, joint mechanics, and bone structures with detailed 3D models.",
    level: "Beginner",
    lessonCount: 9,
    duration: "4.5 hours",
    thumbnailUrl: "https://images.unsplash.com/photo-1564732005956-20420ebdfe9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "advanced-pathology",
    title: "Advanced Pathology Studies",
    description: "Examine common pathological conditions and diseases through interactive 3D visualizations.",
    level: "Advanced",
    lessonCount: 14,
    duration: "10 hours",
    thumbnailUrl: "https://images.unsplash.com/photo-1576671414121-aa0c81714b9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "digestive-system",
    title: "Digestive System Journey",
    description: "Follow the path of food through the digestive system with immersive 3D visualizations and detailed explanations.",
    level: "Beginner",
    lessonCount: 7,
    duration: "3.5 hours",
    thumbnailUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const getCourseById = (id: string) => {
  return courses.find(course => course.id === id);
};
