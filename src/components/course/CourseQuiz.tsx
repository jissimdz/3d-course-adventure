import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, X, Plus } from "lucide-react";
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

const meningesQuestions: ImageQuestion[] = [
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
  },
  {
    id: 2,
    question: "Quelle image montre le sinus sagittal supérieur ?",
    options: [
      {
        image: "https://via.placeholder.com/150?text=Option+1",
        alt: "Option 1",
        isCorrect: false
      },
      {
        image: "https://via.placeholder.com/150?text=Sinus",
        alt: "Sinus sagittal supérieur",
        isCorrect: true
      },
      {
        image: "https://via.placeholder.com/150?text=Option+3",
        alt: "Option 3",
        isCorrect: false
      },
      {
        image: "https://via.placeholder.com/150?text=Option+4",
        alt: "Option 4",
        isCorrect: false
      }
    ]
  }
];

const CourseQuiz: React.FC<QuizSectionProps> = ({ questions = meningesQuestions, onEditClick }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingQuestions, setEditingQuestions] = useState<ImageQuestion[]>(questions);

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
    if (selectedOption !== null && questions[currentQuestion].options[selectedOption].isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
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
    setIsQuizOpen(false);
  };

  const handleEditQuiz = () => {
    setIsEditMode(true);
  };

  const handleSaveQuestion = (data: ImageQuestion) => {
    setEditingQuestions(prev => [...prev, data]);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand-blue">Quiz d'Évaluation</h2>
          <p className="mt-2 text-gray-600">Testez vos connaissances avec ce quiz interactif.</p>
        </div>
        <Button
          onClick={handleEditQuiz}
          variant="outline"
          className="gap-2 text-brand-blue hover:bg-brand-blue/10"
        >
          <Edit2 className="h-4 w-4" />
          Éditer le Quiz
        </Button>
      </div>

      {isEditMode ? (
        <div className="space-y-6 border rounded-lg p-6">
          <h3 className="text-xl font-semibold">Éditer le Quiz</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveQuestion)} className="space-y-4">
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
                  <div key={index} className="space-y-2">
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
                          <FormLabel>Description de l'image {index + 1}</FormLabel>
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
                <Plus className="h-4 w-4 mr-2" />
                Ajouter la Question
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <h4 className="font-medium mb-4">Questions existantes</h4>
            {editingQuestions.map((q, index) => (
              <div key={q.id} className="p-4 border rounded-lg mb-4">
                <p className="font-medium">{q.question}</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="relative">
                      <img
                        src={opt.image}
                        alt={opt.alt}
                        className="w-full h-auto rounded border"
                      />
                      {opt.isCorrect && (
                        <span className="absolute top-2 right-2 text-green-500">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setIsEditMode(false)}
            className="w-full"
            variant="outline"
          >
            Terminer l'édition
          </Button>
        </div>
      ) : (
        <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
              Commencer le Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Quiz sur les méninges</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsQuizOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {!isQuizCompleted ? (
                <div className="space-y-6">
                  <div className="text-sm text-gray-500">
                    Question {currentQuestion + 1}/{questions.length}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {questions[currentQuestion].question}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {questions[currentQuestion].options.map((option, index) => (
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
                    {currentQuestion === questions.length - 1 ? "Terminer" : "Question suivante"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <p className="text-lg font-medium text-green-800">
                      Score: {score} sur {questions.length}
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
