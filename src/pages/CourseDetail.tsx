
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCourseById } from "@/data/coursesData";
import CourseHeader from "@/components/course/CourseHeader";
import CourseSidebar from "@/components/course/CourseSidebar";
import PreviewDialog from "@/components/course/PreviewDialog";
import ModelViewDialog from "@/components/course/ModelViewDialog";
import { getNeuroanatomySections, getGenericCourseSections, getLearningOutcomes } from "@/components/course/CourseSections";
import { CourseContentManager, useCourseContent } from "@/components/course/CourseContentManager";
import { QuizProvider } from "@/components/course/CourseQuizContext";
import CourseTabs from "@/components/course/CourseTabs";

const CourseDetailContent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? getCourseById(courseId) : null;
  const { 
    previewOpen, 
    setPreviewOpen, 
    modelViewOpen, 
    setModelViewOpen,
    selectedPreview,
    handleSidebarPreviewClick
  } = useCourseContent();
  
  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const isNeuroanatomyCourse = courseId === "neuroanatomy";
  
  const courseSections = isNeuroanatomyCourse 
    ? getNeuroanatomySections() 
    : getGenericCourseSections(course.title);

  const learningOutcomes = getLearningOutcomes(isNeuroanatomyCourse, course.title);

  return (
    <>
      <CourseHeader course={course} />

      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <CourseTabs 
                courseId={courseId || ''}
                courseSections={courseSections}
                isNeuroanatomyCourse={isNeuroanatomyCourse}
                learningOutcomes={learningOutcomes}
                course={course}
              />
            </div>

            <div>
              <CourseSidebar 
                course={course} 
                onPreviewClick={() => handleSidebarPreviewClick(courseSections)} 
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
    </>
  );
};

const CourseDetail: React.FC = () => {
  return (
    <Layout>
      <CourseContentManager>
        <QuizProvider>
          <CourseDetailContent />
        </QuizProvider>
      </CourseContentManager>
    </Layout>
  );
};

export default CourseDetail;
