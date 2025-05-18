
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { QuizSeries } from "./types/quizTypes";
import QuizEditor from "./quiz/QuizEditor";
import QuizHeader from "./quiz/QuizHeader";
import QuizLauncher from "./quiz/QuizLauncher";
import { loadQuizSeries, saveQuizSeries, createDefaultSeries } from "./quiz/QuizStorage";
import { useQuiz } from "./CourseQuizContext";

interface CourseQuizProps {
  questions?: any[];
  textQuestions?: any[];
  onEditClick: () => void;
  seriesId?: string;
  courseId: string;
}

const CourseQuiz: React.FC<CourseQuizProps> = ({ 
  questions = [], 
  textQuestions = [],
  onEditClick,
  seriesId = "default",
  courseId
}) => {
  const { courseId: contextCourseId } = useQuiz();
  const [isEditMode, setIsEditMode] = useState(false);
  const [quizSeries, setQuizSeries] = useState<QuizSeries[]>([]);
  const [currentSeriesId, setCurrentSeriesId] = useState<string>(seriesId);

  // Log for debugging
  useEffect(() => {
    console.log(`CourseQuiz component rendered with courseId: ${courseId}`);
    console.log(`Context courseId: ${contextCourseId}`);
  }, [courseId, contextCourseId]);

  // Initialize quiz series with default or saved data
  useEffect(() => {
    const loadedSeries = loadQuizSeries(courseId);
    
    if (loadedSeries.length > 0) {
      setQuizSeries(loadedSeries);
    } else {
      // Initialize with default series
      const defaultSeries = createDefaultSeries(courseId, questions, textQuestions);
      setQuizSeries([defaultSeries]);
      saveQuizSeries(courseId, [defaultSeries]);
    }
  }, [courseId, questions, textQuestions]);

  // Save quiz series to localStorage on change
  useEffect(() => {
    if (quizSeries.length > 0) {
      saveQuizSeries(courseId, quizSeries);
    }
  }, [quizSeries, courseId]);

  const handleFinishEditing = () => {
    setIsEditMode(false);
    // Check if modifications were successfully saved
    try {
      const loadedSeries = loadQuizSeries(courseId);
      if (loadedSeries.length === quizSeries.length) {
        toast.success("Modifications enregistrées avec succès");
      }
    } catch (error) {
      console.error("Error checking saved data:", error);
    }
  };

  return (
    <div className="space-y-6">
      <QuizHeader 
        onEditModeChange={() => setIsEditMode(true)} 
        courseId={courseId} 
      />

      {isEditMode ? (
        <QuizEditor 
          quizSeries={quizSeries}
          setQuizSeries={setQuizSeries}
          currentSeriesId={currentSeriesId}
          setCurrentSeriesId={setCurrentSeriesId}
          onFinishEditing={handleFinishEditing}
          courseId={courseId}
        />
      ) : (
        <QuizLauncher 
          quizSeries={quizSeries}
          currentSeriesId={currentSeriesId}
          onChangeSeriesId={setCurrentSeriesId}
          courseId={courseId}
        />
      )}
    </div>
  );
};

export default CourseQuiz;
