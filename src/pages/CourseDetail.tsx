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

// Add sample quiz data
const sampleQuestions = [
  {
    id: 1,
    question: "Quelle est la principale fonction du cortex cérébral ?",
    options: [
      "Le stockage de la mémoire à long terme",
      "Le traitement des informations sensorielles et motrices",
      "La régulation du sommeil",
      "La production d'hormones"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Où se trouve le thalamus dans le cerveau ?",
    options: [
      "Dans le tronc cérébral",
      "Dans le cervelet",
      "Dans le diencéphale",
      "Dans le cortex cérébral"
    ],
    correctAnswer: 2
  }
];

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState("overview");
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

  const handleQuizEdit = () => {
    console.log("Quiz edit clicked");
    // You can implement quiz editing functionality here
  };

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
                  />
                </TabsContent>
                
                <TabsContent value="instructor">
                  <CourseInstructor />
                </TabsContent>

                <TabsContent value="quiz">
                  <CourseQuiz 
                    questions={sampleQuestions}
                    onEditClick={handleQuizEdit}
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
