
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, X, Plus, Trash2, Upload } from "lucide-react";
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
import { toast } from "sonner";
import TextQuizComponent from "./TextQuizComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImageQuestion {
  id: number;
  question: string;
  options: {
    image: string;
    alt: string;
    isCorrect: boolean;
  }[];
}

interface TextQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

interface QuizSeries {
  id: string;
  name: string;
  imageQuestions: ImageQuestion[];
  textQuestions: TextQuestion[];
}

interface QuizSectionProps {
  questions?: ImageQuestion[];
  textQuestions?: TextQuestion[];
  onEditClick: () => void;
  seriesId?: string;
}

const CourseQuiz: React.FC<QuizSectionProps> = ({ 
  questions = [], 
  textQuestions = [],
  onEditClick,
  seriesId = "default"
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingQuestions, setEditingQuestions] = useState<ImageQuestion[]>(questions);
  const [editingTextQuestions, setEditingTextQuestions] = useState<TextQuestion[]>(textQuestions);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [quizType, setQuizType] = useState<"image" | "text">("image");
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);
  
  // Gestion des séries de quiz
  const [quizSeries, setQuizSeries] = useState<QuizSeries[]>([]);
  const [currentSeriesId, setCurrentSeriesId] = useState<string>(seriesId);
  const [newSeriesName, setNewSeriesName] = useState<string>("");
  
  // Charger toutes les séries de quiz au démarrage
  useEffect(() => {
    try {
      const savedSeries = localStorage.getItem('quizSeries');
      if (savedSeries && savedSeries !== 'undefined') {
        const parsedSeries = JSON.parse(savedSeries);
        setQuizSeries(parsedSeries);
        
        // Si aucune série n'existe, créer la série par défaut
        if (parsedSeries.length === 0) {
          const defaultSeries: QuizSeries = {
            id: "default",
            name: "Quiz par défaut",
            imageQuestions: questions,
            textQuestions: textQuestions
          };
          setQuizSeries([defaultSeries]);
          localStorage.setItem('quizSeries', JSON.stringify([defaultSeries]));
        }
      } else {
        // Initialiser avec la série par défaut
        const defaultSeries: QuizSeries = {
          id: "default",
          name: "Quiz par défaut",
          imageQuestions: questions,
          textQuestions: textQuestions
        };
        setQuizSeries([defaultSeries]);
        localStorage.setItem('quizSeries', JSON.stringify([defaultSeries]));
      }
    } catch (error) {
      console.error("Error loading quiz series from localStorage:", error);
    }
  }, []);

  // Observer les changements dans les séries et sauvegarder dans localStorage
  useEffect(() => {
    if (quizSeries.length > 0) {
      try {
        localStorage.setItem('quizSeries', JSON.stringify(quizSeries));
      } catch (error) {
        console.error("Error saving quiz series to localStorage:", error);
      }
    }
  }, [quizSeries]);

  // Charger les questions pour la série courante
  useEffect(() => {
    const currentSeries = quizSeries.find(series => series.id === currentSeriesId);
    if (currentSeries) {
      setEditingQuestions(currentSeries.imageQuestions);
      setEditingTextQuestions(currentSeries.textQuestions);
    }
  }, [currentSeriesId, quizSeries]);

  // Mettre à jour la série quand les questions sont modifiées
  useEffect(() => {
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

  // Fonctions pour gérer les séries
  const handleAddSeries = () => {
    if (!newSeriesName.trim()) {
      toast.error("Veuillez entrer un nom pour la nouvelle série");
      return;
    }
    
    const newId = `series_${Date.now()}`;
    const newSeries: QuizSeries = {
      id: newId,
      name: newSeriesName,
      imageQuestions: [],
      textQuestions: []
    };
    
    setQuizSeries(prev => [...prev, newSeries]);
    setCurrentSeriesId(newId);
    setNewSeriesName("");
    toast.success(`Nouvelle série "${newSeriesName}" créée`);
  };

  const handleDeleteSeries = (id: string) => {
    if (quizSeries.length <= 1) {
      toast.error("Vous ne pouvez pas supprimer la dernière série");
      return;
    }
    
    setQuizSeries(prev => prev.filter(series => series.id !== id));
    
    // Si la série supprimée est la série courante, sélectionner la première série
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

  // Store state in localStorage whenever questions change
  useEffect(() => {
    try {
      localStorage.setItem(`editingImageQuestions_${currentSeriesId}`, JSON.stringify(editingQuestions));
      localStorage.setItem(`editingTextQuestions_${currentSeriesId}`, JSON.stringify(editingTextQuestions));
    } catch (error) {
      console.error("Error saving quiz questions to localStorage:", error);
    }
  }, [editingQuestions, editingTextQuestions, currentSeriesId]);

  // Load state from localStorage on component mount
  useEffect(() => {
    try {
      const savedImageQuestions = localStorage.getItem(`editingImageQuestions_${currentSeriesId}`);
      const savedTextQuestions = localStorage.getItem(`editingTextQuestions_${currentSeriesId}`);
      
      if (savedImageQuestions && savedImageQuestions !== 'undefined') {
        setEditingQuestions(JSON.parse(savedImageQuestions));
      }
      
      if (savedTextQuestions && savedTextQuestions !== 'undefined') {
        setEditingTextQuestions(JSON.parse(savedTextQuestions));
      }
    } catch (error) {
      console.error("Error loading quiz questions from localStorage:", error);
    }
  }, [currentSeriesId]);

  // Store current form values when form changes to avoid losing data
  const storeFormDataInLocalStorage = (data: any, type: "image" | "text") => {
    try {
      localStorage.setItem(`currentForm_${type}_${currentSeriesId}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${type} form data to localStorage:`, error);
    }
  };

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

  // Initialize forms with stored values or defaults
  const imageForm = useForm<ImageQuestion>({
    defaultValues: (() => {
      try {
        const savedForm = localStorage.getItem(`currentForm_image_${currentSeriesId}`);
        return savedForm && savedForm !== 'undefined' 
          ? JSON.parse(savedForm) 
          : imageFormDefaultValues;
      } catch (error) {
        console.error("Error loading image form from localStorage:", error);
        return imageFormDefaultValues;
      }
    })(),
  });

  const textForm = useForm<TextQuestion>({
    defaultValues: (() => {
      try {
        const savedForm = localStorage.getItem(`currentForm_text_${currentSeriesId}`);
        return savedForm && savedForm !== 'undefined'
          ? JSON.parse(savedForm)
          : textFormDefaultValues;
      } catch (error) {
        console.error("Error loading text form from localStorage:", error);
        return textFormDefaultValues;
      }
    })(),
  });

  // Reset forms when changing series
  useEffect(() => {
    imageForm.reset(imageFormDefaultValues);
    textForm.reset(textFormDefaultValues);
    setSelectedQuestionIndex(null);
  }, [currentSeriesId]);

  // Watch form changes and save to localStorage
  useEffect(() => {
    const imageSubscription = imageForm.watch((value) => {
      storeFormDataInLocalStorage(value, "image");
    });
    
    const textSubscription = textForm.watch((value) => {
      storeFormDataInLocalStorage(value, "text");
    });
    
    return () => {
      imageSubscription.unsubscribe();
      textSubscription.unsubscribe();
    };
  }, [imageForm, textForm, currentSeriesId]);

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
    // Clear form and localStorage after successful submission
    localStorage.removeItem(`currentForm_image_${currentSeriesId}`);
    imageForm.reset(imageFormDefaultValues);
  };

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
    // Clear form and localStorage after successful submission
    localStorage.removeItem(`currentForm_text_${currentSeriesId}`);
    textForm.reset(textFormDefaultValues);
  };

  const handleEditImageQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
    const questionToEdit = editingQuestions[index];
    imageForm.reset(questionToEdit);
    // Update localStorage with the question being edited
    storeFormDataInLocalStorage(questionToEdit, "image");
  };

  const handleEditTextQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
    const questionToEdit = editingTextQuestions[index];
    textForm.reset(questionToEdit);
    // Update localStorage with the question being edited
    storeFormDataInLocalStorage(questionToEdit, "text");
  };

  const handleDeleteImageQuestion = (index: number) => {
    setEditingQuestions(prev => prev.filter((_, i) => i !== index));
    if (selectedQuestionIndex === index) {
      setSelectedQuestionIndex(null);
      imageForm.reset(imageFormDefaultValues);
      localStorage.removeItem(`currentForm_image_${currentSeriesId}`);
    }
    toast.success("Question supprimée");
  };

  const handleDeleteTextQuestion = (index: number) => {
    setEditingTextQuestions(prev => prev.filter((_, i) => i !== index));
    if (selectedQuestionIndex === index) {
      setSelectedQuestionIndex(null);
      textForm.reset(textFormDefaultValues);
      localStorage.removeItem(`currentForm_text_${currentSeriesId}`);
    }
    toast.success("Question supprimée");
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, optionIndex: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Create a data URL from the file instead of uploading to server
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageUrl = e.target.result.toString();
          
          const currentOptions = imageForm.getValues('options');
          currentOptions[optionIndex] = {
            ...currentOptions[optionIndex],
            image: imageUrl,
            alt: file.name,
          };
          imageForm.setValue('options', currentOptions);
          
          // Save form state after upload
          storeFormDataInLocalStorage(imageForm.getValues(), "image");
          toast.success('Image téléchargée avec succès');
        }
      };
      
      reader.onerror = () => {
        toast.error('Échec de lecture du fichier image');
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Échec du téléchargement de l\'image');
    }
  };

  // Deep check if there's at least one correct option selected
  const hasCorrectOption = (options: any[]) => {
    return options.some(option => option.isCorrect === true);
  };

  // Handle form submission with validation
  const onImageFormSubmit = (data: ImageQuestion) => {
    // Check if all fields are filled
    if (!data.question.trim()) {
      toast.error("Veuillez entrer une question");
      return;
    }

    // Check if images are provided
    const missingImages = data.options.some(opt => !opt.image);
    if (missingImages) {
      toast.error("Veuillez fournir des images pour toutes les options");
      return;
    }

    // Check if at least one correct option is selected
    if (!hasCorrectOption(data.options)) {
      toast.error("Veuillez sélectionner au moins une option correcte");
      return;
    }

    handleAddImageQuestion(data);
  };

  const onTextFormSubmit = (data: TextQuestion) => {
    // Check if all fields are filled
    if (!data.question.trim()) {
      toast.error("Veuillez entrer une question");
      return;
    }

    // Check if texts are provided
    const missingTexts = data.options.some(opt => !opt.text.trim());
    if (missingTexts) {
      toast.error("Veuillez fournir du texte pour toutes les options");
      return;
    }

    // Check if at least one correct option is selected
    if (!hasCorrectOption(data.options)) {
      toast.error("Veuillez sélectionner au moins une option correcte");
      return;
    }

    handleAddTextQuestion(data);
  };

  const sampleTextQuestions: TextQuestion[] = [
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
  ];

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
          {/* Gestion des séries de quiz */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-4">Séries de Quiz</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Série actuelle</label>
                <Select value={currentSeriesId} onValueChange={handleChangeSeries}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une série" />
                  </SelectTrigger>
                  <SelectContent>
                    {quizSeries.map(series => (
                      <SelectItem key={series.id} value={series.id}>
                        {series.name} ({series.imageQuestions.length + series.textQuestions.length} questions)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Nouvelle série</label>
                  <Input 
                    placeholder="Nom de la nouvelle série"
                    value={newSeriesName}
                    onChange={(e) => setNewSeriesName(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAddSeries}
                  className="bg-brand-blue hover:bg-brand-blue/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              {quizSeries.length > 1 && (
                <Button
                  variant="outline"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleDeleteSeries(currentSeriesId)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer cette série
                </Button>
              )}
            </div>
          </div>

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
                    if (quizType === "image") {
                      imageForm.reset(imageFormDefaultValues);
                      localStorage.removeItem(`currentForm_image_${currentSeriesId}`);
                    } else {
                      textForm.reset(textFormDefaultValues);
                      localStorage.removeItem(`currentForm_text_${currentSeriesId}`);
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Question
                </Button>
              </div>
            </div>

            <TabsContent value="image">
              <Form {...imageForm}>
                <form onSubmit={imageForm.handleSubmit(onImageFormSubmit)} className="space-y-4">
                  <FormField
                    control={imageForm.control}
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
                    {imageForm.watch("options").map((_, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded-lg">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <FormField
                              control={imageForm.control}
                              name={`options.${index}.image`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Image {index + 1}</FormLabel>
                                  <FormControl>
                                    <div className="flex gap-2">
                                      <Input 
                                        placeholder="URL de l'image..." 
                                        {...field}
                                        className="flex-1"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRefs.current[index]?.click()}
                                      >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload
                                      </Button>
                                      <input
                                        type="file"
                                        ref={el => fileInputRefs.current[index] = el}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, index)}
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={imageForm.control}
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
                            control={imageForm.control}
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

                        {imageForm.watch(`options.${index}.image`) && (
                          <img 
                            src={imageForm.watch(`options.${index}.image`)}
                            alt={imageForm.watch(`options.${index}.alt`)}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">
                    {selectedQuestionIndex !== null ? "Modifier la Question" : "Ajouter la Question"}
                  </Button>
                </form>
              </Form>

              <ScrollArea className="h-[300px] w-full rounded-md border p-4 mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium sticky top-0 bg-white py-2">Questions existantes</h4>
                  {editingQuestions.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      Aucune question avec images. Ajoutez-en une !
                    </div>
                  )}
                  {editingQuestions.map((q, index) => (
                    <div key={q.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{q.question}</p>
                        <div className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditImageQuestion(index)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteImageQuestion(index)}
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
            </TabsContent>

            <TabsContent value="text">
              <Form {...textForm}>
                <form onSubmit={textForm.handleSubmit(onTextFormSubmit)} className="space-y-4">
                  <FormField
                    control={textForm.control}
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
                    {textForm.watch("options").map((_, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex flex-col gap-2">
                          <FormField
                            control={textForm.control}
                            name={`options.${index}.text`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Option {index + 1}</FormLabel>
                                <FormControl>
                                  <Input placeholder="Texte de l'option..." {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={textForm.control}
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
                      </div>
                    ))}
                  </div>

                  <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">
                    {selectedQuestionIndex !== null ? "Modifier la Question" : "Ajouter la Question"}
                  </Button>
                </form>
              </Form>

              <ScrollArea className="h-[300px] w-full rounded-md border p-4 mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium sticky top-0 bg-white py-2">Questions textuelles existantes</h4>
                  {editingTextQuestions.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      Aucune question textuelle. Ajoutez-en une !
                    </div>
                  )}
                  {editingTextQuestions.map((q, index) => (
                    <div key={q.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{q.question}</p>
                        <div className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTextQuestion(index)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTextQuestion(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2 mt-2">
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex justify-between items-center p-2 border rounded">
                            <span>{opt.text}</span>
                            {opt.isCorrect && (
                              <span className="text-green-500">✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

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
                <div className="flex items-center gap-4">
                  <span>Quiz sur les méninges</span>
                  {quizSeries.length > 0 && (
                    <Select value={currentSeriesId} onValueChange={handleChangeSeries}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sélectionner une série" />
                      </SelectTrigger>
                      <SelectContent>
                        {quizSeries.map(series => (
                          <SelectItem key={series.id} value={series.id}>
                            {series.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="image">
              <TabsList className="mb-4">
                <TabsTrigger value="image">Quiz Images</TabsTrigger>
                <TabsTrigger value="text">Quiz Texte</TabsTrigger>
              </TabsList>
              
              <TabsContent value="image">
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
              </TabsContent>
              
              <TabsContent value="text">
                <TextQuizComponent 
                  questions={editingTextQuestions.length > 0 ? editingTextQuestions : sampleTextQuestions} 
                  autoAdvance={true}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CourseQuiz;
