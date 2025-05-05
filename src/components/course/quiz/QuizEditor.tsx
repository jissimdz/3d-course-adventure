
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import QuizSeriesManager from "./QuizSeriesManager";
import ImageQuestionForm from "./ImageQuestionForm";
import TextQuestionForm from "./TextQuestionForm";
import { ImageQuestionsDisplay, TextQuestionsDisplay } from "./QuestionsDisplay";
import { ImageQuestion, TextQuestion, QuizSeries } from "../types/quizTypes";

interface QuizEditorProps {
  quizSeries: QuizSeries[];
  setQuizSeries: React.Dispatch<React.SetStateAction<QuizSeries[]>>;
  currentSeriesId: string;
  setCurrentSeriesId: React.Dispatch<React.SetStateAction<string>>;
  onFinishEditing: () => void;
  courseId: string; // Add courseId to props
}

const QuizEditor: React.FC<QuizEditorProps> = ({
  quizSeries,
  setQuizSeries,
  currentSeriesId,
  setCurrentSeriesId,
  onFinishEditing,
  courseId // Use courseId in the component
}) => {
  const [quizType, setQuizType] = useState<"image" | "text">("image");
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [editingQuestions, setEditingQuestions] = useState<ImageQuestion[]>([]);
  const [editingTextQuestions, setEditingTextQuestions] = useState<TextQuestion[]>([]);

  // Load questions for the current series
  React.useEffect(() => {
    const currentSeries = quizSeries.find(series => series.id === currentSeriesId);
    if (currentSeries) {
      setEditingQuestions(currentSeries.imageQuestions);
      setEditingTextQuestions(currentSeries.textQuestions);
    }
  }, [currentSeriesId, quizSeries]);

  // Update series when questions are modified
  React.useEffect(() => {
    if (currentSeriesId && quizSeries.length > 0) {
      setQuizSeries(prev => 
        prev.map(series => 
          series.id === currentSeriesId 
            ? { ...series, imageQuestions: editingQuestions, textQuestions: editingTextQuestions }
            : series
        )
      );
    }
  }, [editingQuestions, editingTextQuestions]);

  // Default form values for image questions
  const imageFormDefaultValues = {
    id: editingQuestions.length > 0 ? Math.max(...editingQuestions.map(q => q.id)) + 1 : 1,
    question: "",
    options: [
      { image: "", alt: "", isCorrect: false },
      { image: "", alt: "", isCorrect: false },
      { image: "", alt: "", isCorrect: false },
      { image: "", alt: "", isCorrect: false },
    ],
  };

  // Default form values for text questions
  const textFormDefaultValues = {
    id: editingTextQuestions.length > 0 ? Math.max(...editingTextQuestions.map(q => q.id)) + 1 : 1,
    question: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  };

  // Functions for series management
  const handleAddSeries = (name: string) => {
    const newId = `series_${Date.now()}`;
    const newSeries: QuizSeries = {
      id: newId,
      name,
      courseId: courseId, // Include courseId in new series
      imageQuestions: [],
      textQuestions: []
    };
    
    setQuizSeries(prev => [...prev, newSeries]);
    setCurrentSeriesId(newId);
    toast.success(`Nouvelle série "${name}" créée`);
  };

  const handleDeleteSeries = (id: string) => {
    if (quizSeries.length <= 1) {
      toast.error("Vous ne pouvez pas supprimer la dernière série");
      return;
    }
    
    setQuizSeries(prev => prev.filter(series => series.id !== id));
    
    // If the deleted series is the current series, select the first series
    if (id === currentSeriesId) {
      const remainingSeries = quizSeries.filter(series => series.id !== id);
      if (remainingSeries.length > 0) {
        setCurrentSeriesId(remainingSeries[0].id);
      }
    }
    
    toast.success("Série supprimée");
  };

  const handleChangeSeries = (id: string) => {
    setCurrentSeriesId(id);
  };

  // Functions for image questions
  const handleAddImageQuestion = (data: ImageQuestion) => {
    if (selectedQuestionIndex !== null) {
      const updatedQuestions = [...editingQuestions];
      updatedQuestions[selectedQuestionIndex] = data;
      setEditingQuestions(updatedQuestions);
      setSelectedQuestionIndex(null);
      toast.success("Question modifiée avec succès");
    } else {
      // Ensure the new question has a unique ID
      const newId = editingQuestions.length > 0 
        ? Math.max(...editingQuestions.map(q => q.id)) + 1 
        : 1;
      const newQuestion = { ...data, id: newId };
      setEditingQuestions(prev => [...prev, newQuestion]);
      toast.success("Question ajoutée avec succès");
    }
    // Clear form localStorage after successful submission
    localStorage.removeItem(`currentForm_image_${currentSeriesId}`);
  };

  const handleEditImageQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
    setQuizType("image");
  };

  const handleDeleteImageQuestion = (index: number) => {
    setEditingQuestions(prev => prev.filter((_, i) => i !== index));
    if (selectedQuestionIndex === index) {
      setSelectedQuestionIndex(null);
      localStorage.removeItem(`currentForm_image_${currentSeriesId}`);
    }
    toast.success("Question supprimée");
  };

  // Functions for text questions
  const handleAddTextQuestion = (data: TextQuestion) => {
    if (selectedQuestionIndex !== null) {
      const updatedQuestions = [...editingTextQuestions];
      updatedQuestions[selectedQuestionIndex] = data;
      setEditingTextQuestions(updatedQuestions);
      setSelectedQuestionIndex(null);
      toast.success("Question modifiée avec succès");
    } else {
      // Ensure the new question has a unique ID
      const newId = editingTextQuestions.length > 0 
        ? Math.max(...editingTextQuestions.map(q => q.id)) + 1 
        : 1;
      const newQuestion = { ...data, id: newId };
      setEditingTextQuestions(prev => [...prev, newQuestion]);
      toast.success("Question ajoutée avec succès");
    }
    // Clear form localStorage after successful submission
    localStorage.removeItem(`currentForm_text_${currentSeriesId}`);
  };

  const handleEditTextQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
    setQuizType("text");
  };

  const handleDeleteTextQuestion = (index: number) => {
    setEditingTextQuestions(prev => prev.filter((_, i) => i !== index));
    if (selectedQuestionIndex === index) {
      setSelectedQuestionIndex(null);
      localStorage.removeItem(`currentForm_text_${currentSeriesId}`);
    }
    toast.success("Question supprimée");
  };

  return (
    <div className="space-y-6 border rounded-lg p-6">
      <QuizSeriesManager
        quizSeries={quizSeries}
        currentSeriesId={currentSeriesId}
        onChangeSeries={handleChangeSeries}
        onAddSeries={handleAddSeries}
        onDeleteSeries={handleDeleteSeries}
        courseId={courseId} // Pass courseId to QuizSeriesManager
      />

      <Tabs defaultValue="image" value={quizType} onValueChange={(v) => setQuizType(v as "image" | "text")}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {selectedQuestionIndex !== null ? "Modifier la Question" : "Ajouter une Question"}
          </h3>
          <div className="flex items-center gap-4">
            <TabsList>
              <TabsTrigger value="image">Quiz avec Images</TabsTrigger>
              <TabsTrigger value="text">Quiz Textuel</TabsTrigger>
            </TabsList>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedQuestionIndex(null);
                localStorage.removeItem(`currentForm_${quizType}_${currentSeriesId}`);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Question
            </Button>
          </div>
        </div>

        <TabsContent value="image">
          <ImageQuestionForm
            defaultValues={
              selectedQuestionIndex !== null 
                ? editingQuestions[selectedQuestionIndex]
                : imageFormDefaultValues
            }
            onSubmit={handleAddImageQuestion}
            currentSeriesId={currentSeriesId}
          />
          <ImageQuestionsDisplay
            questions={editingQuestions}
            onEdit={handleEditImageQuestion}
            onDelete={handleDeleteImageQuestion}
          />
        </TabsContent>

        <TabsContent value="text">
          <TextQuestionForm
            defaultValues={
              selectedQuestionIndex !== null 
                ? editingTextQuestions[selectedQuestionIndex]
                : textFormDefaultValues
            }
            onSubmit={handleAddTextQuestion}
            currentSeriesId={currentSeriesId}
          />
          <TextQuestionsDisplay
            questions={editingTextQuestions}
            onEdit={handleEditTextQuestion}
            onDelete={handleDeleteTextQuestion}
          />
        </TabsContent>
      </Tabs>

      <Button
        onClick={onFinishEditing}
        className="w-full"
        variant="outline"
      >
        Terminer l'édition
      </Button>
    </div>
  );
};

export default QuizEditor;
