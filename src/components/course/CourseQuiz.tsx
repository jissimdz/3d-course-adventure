
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageQuestion {
  id: number;
  question: string;
  options: {
    image: string;
    alt: string;
    isCorrect: boolean;
  }[];
}

interface QuizSectionProps {
  questions?: ImageQuestion[];
  onEditClick: () => void;
}

const CourseQuiz: React.FC<QuizSectionProps> = ({ questions = [], onEditClick }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingQuestions, setEditingQuestions] = useState<ImageQuestion[]>(questions);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);

  const form = useForm<ImageQuestion>({
    defaultValues: {
      id: editingQuestions.length + 1,
      question: "",
      options: [
        { image: "", alt: "", isCorrect: false },
        { image: "", alt: "", isCorrect: false },
        { image: "", alt: "", isCorrect: false },
        { image: "", alt: "", isCorrect: false },
      ],
    },
  });

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null && editingQuestions[currentQuestion].options[selectedOption].isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion < editingQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const handleAddQuestion = (data: ImageQuestion) => {
    if (selectedQuestionIndex !== null) {
      const updatedQuestions = [...editingQuestions];
      updatedQuestions[selectedQuestionIndex] = data;
      setEditingQuestions(updatedQuestions);
      setSelectedQuestionIndex(null);
    } else {
      setEditingQuestions(prev => [...prev, data]);
    }
    form.reset();
  };

  const handleEditQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
    form.reset(editingQuestions[index]);
  };

  const handleDeleteQuestion = (index: number) => {
    setEditingQuestions(prev => prev.filter((_, i) => i !== index));
    if (selectedQuestionIndex === index) {
      setSelectedQuestionIndex(null);
      form.reset();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand-blue">Quiz d'Évaluation</h2>
          <p className="mt-2 text-gray-600">Testez vos connaissances avec ce quiz interactif.</p>
        </div>
        <Button
          onClick={() => setIsEditMode(true)}
          variant="outline"
          className="gap-2 text-brand-blue hover:bg-brand-blue/10"
        >
          <Edit2 className="h-4 w-4" />
          Éditer le Quiz
        </Button>
      </div>

      {isEditMode ? (
        <div className="space-y-6 border rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              {selectedQuestionIndex !== null ? "Modifier la Question" : "Ajouter une Question"}
            </h3>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedQuestionIndex(null);
                form.reset();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Question
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddQuestion)} className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez la question..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h4 className="font-medium">Options de réponse</h4>
                {form.watch("options").map((_, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <FormField
                      control={form.control}
                      name={`options.${index}.image`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL {index + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`options.${index}.alt`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description {index + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder="Description..." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`options.${index}.isCorrect`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <FormLabel>Réponse correcte</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">
                {selectedQuestionIndex !== null ? "Modifier la Question" : "Ajouter la Question"}
              </Button>
            </form>
          </Form>

          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
              <h4 className="font-medium sticky top-0 bg-white py-2">Questions existantes</h4>
              {editingQuestions.map((q, index) => (
                <div key={q.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">{q.question}</p>
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditQuestion(index)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="relative">
                        <img
                          src={opt.image}
                          alt={opt.alt}
                          className="w-full h-auto rounded border"
                        />
                        {opt.isCorrect && (
                          <span className="absolute top-2 right-2 text-green-500">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Button
            onClick={() => setIsEditMode(false)}
            className="w-full"
            variant="outline"
          >
            Terminer l'édition
          </Button>
        </div>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
              Commencer le Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Quiz sur les méninges</span>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {!isQuizCompleted ? (
                <div className="space-y-6">
                  <div className="text-sm text-gray-500">
                    Question {currentQuestion + 1}/{editingQuestions.length}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {editingQuestions[currentQuestion]?.question}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {editingQuestions[currentQuestion]?.options.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleOptionSelect(index)}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-brand-blue",
                            selectedOption === index ? "border-brand-blue" : "border-gray-200"
                          )}
                        >
                          <img
                            src={option.image}
                            alt={option.alt}
                            className="w-full h-auto rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedOption === null}
                    className="w-full bg-brand-blue hover:bg-brand-blue/90"
                  >
                    {currentQuestion === editingQuestions.length - 1 ? "Terminer" : "Question suivante"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <p className="text-lg font-medium text-green-800">
                      Score: {score} sur {editingQuestions.length}
                    </p>
                  </div>
                  <Button
                    onClick={resetQuiz}
                    className="w-full"
                    variant="outline"
                  >
                    Recommencer le Quiz
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CourseQuiz;

