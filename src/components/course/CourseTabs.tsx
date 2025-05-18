
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseOverview from "@/components/course/CourseOverview";
import CourseCurriculum from "@/components/course/CourseCurriculum";
import CourseInstructor from "@/components/course/CourseInstructor";
import CourseQuiz from "@/components/course/CourseQuiz";
import { useCourseContent } from "@/components/course/CourseContentManager";
import { useQuiz } from "@/components/course/CourseQuizContext";
import { CourseSection } from "@/components/course/CourseSections";

interface CourseTabsProps {
  courseId: string;
  courseSections: CourseSection[];
  isNeuroanatomyCourse: boolean;
  learningOutcomes: string[];
  course: any;
}

const CourseTabs: React.FC<CourseTabsProps> = ({
  courseId,
  courseSections,
  isNeuroanatomyCourse,
  learningOutcomes,
  course
}) => {
  const { 
    activeTab,
    setActiveTab,
    handlePreviewClick,
    handle3DModelClick
  } = useCourseContent();

  const { 
    activeQuizSection,
    activeQuizSeries,
    quizzesBySection,
    textQuizzesBySection,
    handleQuizStart,
    handleQuizEdit
  } = useQuiz();

  const quizQuestions = 
    activeQuizSection !== null && quizzesBySection[activeQuizSection]
      ? quizzesBySection[activeQuizSection]
      : [];

  const textQuizQuestions =
    activeQuizSection !== null && textQuizzesBySection[activeQuizSection]
      ? textQuizzesBySection[activeQuizSection]
      : [];

  // Handle starting a quiz by switching to the quiz tab
  const handleStartQuiz = (sectionId: number) => {
    // Switch to quiz tab
    setActiveTab("quiz");
    // Call the context handler
    handleQuizStart(sectionId);
  };

  return (
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
          onModelViewOpen={handle3DModelClick}
        />
      </TabsContent>
      
      <TabsContent value="curriculum">
        <CourseCurriculum 
          courseSections={courseSections}
          course={course}
          onPreviewClick={handlePreviewClick}
          on3DModelClick={handle3DModelClick}
          onQuizStart={handleStartQuiz}
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
          courseId={courseId} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default CourseTabs;
