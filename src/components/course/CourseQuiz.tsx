
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { QuizSeries } from "./types/quizTypes";
import QuizHeader from "./quiz/QuizHeader";
import QuizLauncher from "./quiz/QuizLauncher";
import QuizEditor from "./quiz/QuizEditor";
import { loadQuizSeries, createDefaultSeries, saveQuizSeries } from "./quiz/QuizStorage";
import { useQuiz } from "./CourseQuizContext";
import { Button } from "@/components/ui/button";
import { Book, Edit, ExternalLink } from "lucide-react";

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
  seriesId = "default",
  courseId
}) => {
  const { courseId: contextCourseId } = useQuiz();
  const [quizSeries, setQuizSeries] = useState<QuizSeries[]>([]);
  const [currentSeriesId, setCurrentSeriesId] = useState<string>(seriesId);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Log for debugging
  useEffect(() => {
    console.log(`CourseQuiz component rendered with courseId: ${courseId}`);
    console.log(`Context courseId: ${contextCourseId}`);
  }, [courseId, contextCourseId]);

  // Initialize quiz series - SEULEMENT charger les données sauvegardées
  useEffect(() => {
    const initializeQuizSeries = () => {
      try {
        setIsLoading(true);
        console.log(`Initializing quiz series for course ${courseId}...`);
        
        // Charger UNIQUEMENT les séries existantes sauvegardées
        const loadedSeries = loadQuizSeries(courseId);
        console.log(`Loaded series from storage:`, loadedSeries);
        
        // TOUJOURS utiliser les données chargées, même si elles sont vides ou différentes
        setQuizSeries(loadedSeries);
        
        // Pour le cours neuroanatomy, chercher automatiquement la série "neuroanatomie"
        if (courseId === "neuroanatomy" && loadedSeries.length > 0) {
          const neuroanatomySeries = loadedSeries.find(series => 
            series.name.toLowerCase().includes('neuroanatomie') || 
            series.id.toLowerCase().includes('neuroanatomie')
          );
          if (neuroanatomySeries) {
            setCurrentSeriesId(neuroanatomySeries.id);
            console.log(`Found neuroanatomie series: ${neuroanatomySeries.id}`);
          } else {
            // Utiliser la première série disponible
            setCurrentSeriesId(loadedSeries[0].id);
          }
        }
        
        console.log("Quiz series set to loaded data:", loadedSeries);
        setHasError(false);
      } catch (error) {
        console.error("Error loading quiz series:", error);
        setHasError(true);
        toast.error("Erreur lors du chargement du quiz");
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuizSeries();
  }, [courseId]); // Seulement courseId comme dépendance

  const handleStartQuiz = () => {
    console.log("Starting quiz with current series:", quizSeries);
    console.log("Current series ID:", currentSeriesId);
    
    if (quizSeries.length === 0) {
      toast.error("Aucune série de quiz disponible. Veuillez créer des questions d'abord.");
      return;
    }
    
    // Make sure currentSeriesId exists
    const seriesExists = quizSeries.some(series => series.id === currentSeriesId);
    if (!seriesExists && quizSeries.length > 0) {
      // Pour neuroanatomy, chercher la série neuroanatomie
      if (courseId === "neuroanatomy") {
        const neuroanatomySeries = quizSeries.find(series => 
          series.name.toLowerCase().includes('neuroanatomie') || 
          series.id.toLowerCase().includes('neuroanatomie')
        );
        if (neuroanatomySeries) {
          setCurrentSeriesId(neuroanatomySeries.id);
          console.log(`Using neuroanatomie series: ${neuroanatomySeries.id}`);
        } else {
          setCurrentSeriesId(quizSeries[0].id);
        }
      } else {
        setCurrentSeriesId(quizSeries[0].id);
      }
    }
    
    setIsQuizOpen(true);
  };

  const handleEditQuiz = () => {
    setIsEditMode(true);
  };

  const handleFinishEditing = () => {
    setIsEditMode(false);
    // Recharger les séries après édition pour s'assurer qu'on a les dernières données
    const updatedSeries = loadQuizSeries(courseId);
    setQuizSeries(updatedSeries);
    toast.success("Modifications sauvegardées");
  };

  const handleQuizSeriesUpdate = (updatedSeries: QuizSeries[]) => {
    console.log("Updating quiz series:", updatedSeries);
    setQuizSeries(updatedSeries);
    const success = saveQuizSeries(courseId, updatedSeries);
    if (success) {
      console.log("Quiz series updated and saved successfully");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p>Chargement du quiz...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Erreur lors du chargement du quiz</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <QuizEditor
        quizSeries={quizSeries}
        setQuizSeries={handleQuizSeriesUpdate}
        currentSeriesId={currentSeriesId}
        setCurrentSeriesId={setCurrentSeriesId}
        onFinishEditing={handleFinishEditing}
        courseId={courseId}
      />
    );
  }

  // Afficher des informations de débogage pour savoir quelle série sera utilisée
  const currentSeries = quizSeries.find(series => series.id === currentSeriesId);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-medium mb-4 text-brand-blue">Quiz d'évaluation : Aperçu du cerveau</h3>
        
        {/* Ajout de la vidéo */}
        <div className="mb-6 aspect-video w-full overflow-hidden rounded-md">
          <iframe 
            src="https://drive.google.com/file/d/1D192QjWoOHRerEDG6P3LSkABrZo-Ih-H/preview" 
            className="w-full h-full"
            title="Introduction à la neuroanatomie"
            allow="autoplay; fullscreen" 
            frameBorder="0"
          ></iframe>
        </div>
        
        <p className="mb-4">Testez vos connaissances avec notre quiz interactif sur l'aperçu du cerveau. Ce quiz comporte des questions à choix multiples avec des images et du texte dans la même série.</p>
        
        {/* Affichage de la série qui sera utilisée */}
        {currentSeries && (
          <div className="mb-4 p-3 bg-green-50 rounded border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Série active :</strong> {currentSeries.name} 
              ({currentSeries.imageQuestions.length + currentSeries.textQuestions.length} questions)
            </p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-brand-blue hover:bg-brand-blue/90"
            onClick={handleStartQuiz}
            disabled={isLoading}
          >
            <Book className="h-4 w-4 mr-2" />
            Commencer le Quiz
          </Button>
          
          <Button 
            variant="outline"
            className="text-brand-blue border-brand-blue hover:bg-brand-blue/10"
            onClick={handleEditQuiz}
          >
            <Edit className="h-4 w-4 mr-2" />
            Éditer le Quiz
          </Button>

          <Button 
            variant="outline"
            className="text-brand-blue border-brand-blue hover:bg-brand-blue/10"
            onClick={() => window.open("https://drive.google.com/file/d/1H4mJa9YpkRugRRH7Moz3-WixlFjS3PKF/view?usp=sharing", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Voir la Vidéo
          </Button>
        </div>
        
        {quizSeries.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium mb-2">Séries disponibles :</p>
            {quizSeries.map(series => (
              <div key={series.id} className={`p-2 rounded ${series.id === currentSeriesId ? 'bg-blue-100' : ''}`}>
                • Série "{series.name}": {series.imageQuestions.length + series.textQuestions.length} questions
                {series.id === currentSeriesId && <span className="text-blue-600 ml-2">(sélectionnée)</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <QuizLauncher 
        quizSeries={quizSeries}
        currentSeriesId={currentSeriesId}
        onChangeSeriesId={setCurrentSeriesId}
        courseId={courseId}
        isOpen={isQuizOpen}
        onOpenChange={setIsQuizOpen}
      />
    </div>
  );
};

export default CourseQuiz;
