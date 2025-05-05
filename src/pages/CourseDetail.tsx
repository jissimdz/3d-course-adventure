
import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCourseById } from "@/data/coursesData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseHeader from "@/components/course/CourseHeader";
import CourseOverview from "@/components/course/CourseOverview";
import CourseCurriculum from "@/components/course/CourseCurriculum";
import CourseInstructor from "@/components/course/CourseInstructor";
import CourseSidebar from "@/components/course/CourseSidebar";
import PreviewDialog from "@/components/course/PreviewDialog";
import ModelViewDialog from "@/components/course/ModelViewDialog";
import CourseQuiz from "@/components/course/CourseQuiz";
import { 
  getNeuroanatomySections, 
  getGenericCourseSections, 
  getLearningOutcomes,
  CourseSection
} from "@/components/course/CourseSections";
import { ImageQuestion, TextQuestion } from "@/components/course/types/quizTypes";

// Sample quiz questions
const sampleQuestions: ImageQuestion[] = [
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
  }
];

// Quiz questions by section
const quizzesBySection: Record<number, ImageQuestion[]> = {
  1: [
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
    }
  ],
  2: [
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
  ]
};

// Text quiz questions by section
const textQuizzesBySection: Record<number, TextQuestion[]> = {
  1: [
    {
      id: 1,
      question: "Quelle est la capitale de la France ?",
      options: [
        { text: "Paris", isCorrect: true },
        { text: "Lyon", isCorrect: false },
        { text: "Marseille", isCorrect: false },
        { text: "Bordeaux", isCorrect: false }
      ]
    }
  ],
  2: [
    {
      id: 2,
      question: "Quel est le plus grand organe du corps humain ?",
      options: [
        { text: "La peau", isCorrect: true },
        { text: "Le foie", isCorrect: false },
        { text: "Le cerveau", isCorrect: false },
        { text: "Les poumons", isCorrect: false }
      ]
    }
  ]
};

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeQuizSection, setActiveQuizSection] = useState<number | null>(null);
  const [activeQuizSeries, setActiveQuizSeries] = useState<string>("default");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<{title: string; id: number; videoUrl?: string} | null>(null);
  const [modelViewOpen, setModelViewOpen] = useState(false);
  
  const course = courseId ? getCourseById(courseId) : null;
  
  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const isNeuroanatomyCourse = courseId === "neuroanatomy";
  
  const courseSections = isNeuroanatomyCourse 
    ? getNeuroanatomySections() 
    : getGenericCourseSections(course.title);

  const learningOutcomes = getLearningOutcomes(isNeuroanatomyCourse, course.title);

  const handlePreviewClick = (section: CourseSection) => {
    setSelectedPreview(section);
    setPreviewOpen(true);
  };

  const handleSidebarPreviewClick = () => {
    const firstPreviewSection = courseSections.find(section => section.isPreview);
    if (firstPreviewSection) {
      if (firstPreviewSection.videoUrl) {
        handlePreviewClick(firstPreviewSection);
      } else if (firstPreviewSection.has3DModel) {
        setModelViewOpen(true);
      }
    }
  };

  const handle3DModelClick = () => {
    setModelViewOpen(true);
  };

  const handleQuizStart = (sectionId: number, seriesId: string = "default") => {
    setActiveQuizSection(sectionId);
    setActiveQuizSeries(seriesId);
    setActiveTab("quiz");
  };

  const handleQuizEdit = () => {
    console.log("Quiz edit clicked");
    // You can implement quiz editing functionality here
  };

  const quizQuestions = 
    activeQuizSection !== null && quizzesBySection[activeQuizSection]
      ? quizzesBySection[activeQuizSection]
      : [];

  const textQuizQuestions =
    activeQuizSection !== null && textQuizzesBySection[activeQuizSection]
      ? textQuizzesBySection[activeQuizSection]
      : [];

  return (
    <Layout>
      <CourseHeader course={course} />

      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Aperçu</TabsTrigger>
                  <TabsTrigger value="curriculum">Programme</TabsTrigger>
                  <TabsTrigger value="instructor">Instructeur</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <CourseOverview 
                    isNeuroanatomyCourse={isNeuroanatomyCourse} 
                    learningOutcomes={learningOutcomes}
                    onModelViewOpen={() => setModelViewOpen(true)}
                  />
                </TabsContent>
                
                <TabsContent value="curriculum">
                  <CourseCurriculum 
                    courseSections={courseSections}
                    course={course}
                    onPreviewClick={handlePreviewClick}
                    on3DModelClick={handle3DModelClick}
                    onQuizStart={handleQuizStart}
                  />
                </TabsContent>
                
                <TabsContent value="instructor">
                  <CourseInstructor />
                </TabsContent>

                <TabsContent value="quiz">
                  <CourseQuiz 
                    questions={quizQuestions}
                    textQuestions={textQuizQuestions}
                    onEditClick={handleQuizEdit}
                    seriesId={activeQuizSeries}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <CourseSidebar 
                course={course} 
                onPreviewClick={handleSidebarPreviewClick} 
              />
            </div>
          </div>
        </div>
      </div>

      <PreviewDialog 
        open={previewOpen} 
        onOpenChange={setPreviewOpen} 
        selectedPreview={selectedPreview} 
      />

      <ModelViewDialog 
        open={modelViewOpen} 
        onOpenChange={setModelViewOpen} 
      />
    </Layout>
  );
};

export default CourseDetail;
