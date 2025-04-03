import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCourseById } from "@/data/coursesData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Award, Check, Brain, Layers, Video, Play, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<{title: string; id: number} | null>(null);
  
  const course = courseId ? getCourseById(courseId) : null;
  
  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  // Enhanced content for Neuroanatomy course
  const isNeuroanatomyCourse = courseId === "neuroanatomy";
  
  // Custom course sections based on course ID
  const courseSections = isNeuroanatomyCourse ? [
    {
      id: 1,
      title: "Introduction à la Neuroanatomie",
      duration: "30 min",
      isPreview: true,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      id: 2,
      title: "Structure et Organisation du Système Nerveux",
      duration: "45 min",
      isPreview: false,
    },
    {
      id: 3,
      title: "Exploration 3D du Cerveau",
      duration: "60 min",
      isPreview: false,
    },
    {
      id: 4,
      title: "Les Voies Neuronales et la Signalisation",
      duration: "50 min",
      isPreview: false,
    },
    {
      id: 5,
      title: "Neuroanatomie Clinique et Applications",
      duration: "45 min",
      isPreview: false,
    },
    {
      id: 6,
      title: "Évaluation et Pratique Interactive",
      duration: "40 min",
      isPreview: false,
    },
  ] : [
    {
      id: 1,
      title: "Introduction au Cours",
      duration: "15 min",
      isPreview: true,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      id: 2,
      title: `Concepts de Base en ${course.title}`,
      duration: "30 min",
      isPreview: false,
    },
    {
      id: 3,
      title: "Exploration 3D Interactive",
      duration: "45 min",
      isPreview: false,
    },
    {
      id: 4,
      title: "Structures et Fonctions Clés",
      duration: "60 min",
      isPreview: false,
    },
    {
      id: 5,
      title: "Quiz et Évaluation",
      duration: "20 min",
      isPreview: false,
    },
  ];

  // Custom learning outcomes based on course ID
  const learningOutcomes = isNeuroanatomyCourse ? [
    "Comprendre l'organisation structurelle complexe du cerveau et du système nerveux",
    "Maîtriser l'identification des structures cérébrales importantes via des modèles 3D interactifs",
    "Analyser les connexions entre les différentes régions du cerveau et leur rôle fonctionnel",
    "Explorer le système nerveux central et périphérique en détail",
    "Appliquer les connaissances en neuroanatomie à la compréhension des troubles neurologiques courants",
    "Développer une compréhension approfondie des voies neuronales et des mécanismes de signalisation"
  ] : [
    `Comprendre les composants fondamentaux de ${course.title.toLowerCase()}`,
    "Naviguer et manipuler des modèles 3D pour explorer les structures anatomiques",
    `Identifier les éléments clés et leurs fonctions dans ${course.title.toLowerCase()}`,
    "Appliquer les connaissances à travers des quiz interactifs et des évaluations",
    "Établir des liens entre les structures anatomiques et leurs fonctions physiologiques",
  ];

  // Generate neuroanatomy-specific course description
  const getCourseDescription = () => {
    if (isNeuroanatomyCourse) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-brand-blue">
              À Propos de ce Cours
            </h2>
            <p className="mt-3 text-gray-700">
              Ce cours avancé d'exploration neuroanatomique vous fait plonger dans les mystères 
              complexes du cerveau humain et du système nerveux. À travers une technologie de 
              visualisation 3D de pointe, vous découvrirez les structures cérébrales, les voies 
              neuronales et les mécanismes fondamentaux qui gouvernent notre système nerveux.
            </p>
            
            <p className="mt-3 text-gray-700">
              Des modèles interactifs en trois dimensions vous permettront de naviguer à travers 
              les différentes couches du cerveau, d'explorer les régions anatomiques clés et de 
              comprendre comment les neurones communiquent entre eux. Chaque module combine des 
              explications théoriques avec des visualisations pratiques pour renforcer votre 
              compréhension.
            </p>
            
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="p-4 text-center">
                <Brain className="mx-auto mb-2 h-10 w-10 text-brand-blue" />
                <h3 className="text-lg font-medium">Modélisation 3D Avancée</h3>
                <p className="text-sm text-gray-600">Explorez chaque structure cérébrale en détail</p>
              </Card>
              
              <Card className="p-4 text-center">
                <Layers className="mx-auto mb-2 h-10 w-10 text-brand-blue" />
                <h3 className="text-lg font-medium">Anatomie en Couches</h3>
                <p className="text-sm text-gray-600">Naviguez à travers les différentes couches du système nerveux</p>
              </Card>
              
              <Card className="p-4 text-center">
                <Video className="mx-auto mb-2 h-10 w-10 text-brand-blue" />
                <h3 className="text-lg font-medium">Animations Interactives</h3>
                <p className="text-sm text-gray-600">Visualisez le fonctionnement des voies neuronales</p>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-brand-blue">
              Ce que Vous Apprendrez
            </h2>
            <ul className="mt-3 space-y-2">
              {learningOutcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <Check className="h-5 w-5 shrink-0 text-green-500" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-brand-blue">
              Prérequis
            </h2>
            <ul className="mt-3 list-disc pl-5 text-gray-700">
              <li>Connaissances de base en anatomie humaine recommandées</li>
              <li>Un navigateur web moderne qui prend en charge les graphiques 3D avancés</li>
              <li>Intérêt pour les neurosciences et la structure du cerveau humain</li>
              <li>Aucune expérience préalable en neurologie n'est requise</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-brand-blue">
              Public Cible
            </h2>
            <ul className="mt-3 list-disc pl-5 text-gray-700">
              <li>Étudiants en médecine, neurosciences ou disciplines connexes</li>
              <li>Professionnels de la santé souhaitant approfondir leurs connaissances en neuroanatomie</li>
              <li>Chercheurs dans le domaine des neurosciences</li>
              <li>Passionnés des sciences cognitives et du fonctionnement du cerveau</li>
            </ul>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-brand-blue">
              À Propos de ce Cours
            </h2>
            <p className="mt-3 text-gray-700">
              Ce cours complet vous emmène dans un voyage à travers {course.title.toLowerCase()}, 
              en utilisant une technologie de visualisation 3D de pointe pour rendre les concepts complexes 
              faciles à comprendre. Que vous soyez étudiant en médecine, professionnel de la santé ou 
              simplement curieux de l'anatomie humaine, ce cours vous apportera des connaissances et 
              des perspectives précieuses.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-brand-blue">
              Ce que Vous Apprendrez
            </h2>
            <ul className="mt-3 space-y-2">
              {learningOutcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <Check className="h-5 w-5 shrink-0 text-green-500" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-brand-blue">
              Prérequis
            </h2>
            <ul className="mt-3 list-disc pl-5 text-gray-700">
              <li>Aucune connaissance préalable requise - adapté aux débutants</li>
              <li>Un navigateur web moderne qui prend en charge les graphiques 3D</li>
              <li>Intérêt pour l'apprentissage de l'anatomie et de la physiologie humaines</li>
            </ul>
          </div>
        </div>
      );
    }
  };

  // Handle preview button click
  const handlePreviewClick = (section: any) => {
    setSelectedPreview(section);
    setPreviewOpen(true);
  };

  return (
    <Layout>
      {/* Course Header */}
      <div
        className="relative bg-cover bg-center py-20 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${course.thumbnailUrl})`,
        }}
      >
        <div className="container mx-auto px-4">
          <Badge
            className="mb-4"
            style={{
              backgroundColor:
                course.level === "Beginner"
                  ? "#84cc16"
                  : course.level === "Intermediate"
                  ? "#3b82f6"
                  : "#a855f7",
            }}
          >
            {course.level === "Beginner" ? "Débutant" : course.level === "Intermediate" ? "Intermédiaire" : "Avancé"}
          </Badge>
          <h1 className="text-4xl font-bold md:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-lg">{course.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>{course.lessonCount} leçons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Main Content */}
            <div className="md:col-span-2">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Aperçu</TabsTrigger>
                  <TabsTrigger value="curriculum">Programme</TabsTrigger>
                  <TabsTrigger value="instructor">Instructeur</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  {getCourseDescription()}
                </TabsContent>
                
                <TabsContent value="curriculum">
                  <div>
                    <h2 className="text-2xl font-semibold text-brand-blue">
                      Programme du Cours
                    </h2>
                    <p className="mt-2 text-gray-600">
                      {courseSections.length} sections • {course.lessonCount} leçons • {course.duration} durée totale
                    </p>
                    
                    <div className="mt-6 space-y-4">
                      {courseSections.map((section) => (
                        <div key={section.id} className="rounded-md border border-gray-200 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{section.title}</h3>
                              {section.isPreview && (
                                <Badge variant="outline" className="border-brand-teal text-brand-teal">
                                  Aperçu
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-sm text-gray-500">{section.duration}</div>
                              {section.isPreview && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center gap-1 text-brand-blue"
                                  onClick={() => handlePreviewClick(section)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>Aperçu</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="instructor">
                  <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
                    <div className="h-32 w-32 overflow-hidden rounded-full">
                      <img
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                        alt="Instructeur"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-brand-blue">
                        Dr. Souttou
                      </h2>
                      <p className="text-brand-teal">Spécialiste en Neurobiologie</p>
                      <p className="mt-4 text-gray-700">
                        Dr. Souttou est une éducatrice médicale renommée avec plus de 15 ans 
                        d'expérience dans l'enseignement de l'anatomie et de la physiologie. Elle a 
                        développé de nombreuses approches innovantes pour l'éducation médicale, en 
                        se concentrant sur l'utilisation de la technologie de visualisation 3D pour 
                        améliorer la compréhension des structures anatomiques complexes.
                      </p>
                      <p className="mt-3 text-gray-700">
                        Elle détient un doctorat en Éducation Médicale de l'Université de Paris et 
                        a beaucoup publié sur les méthodes d'enseignement efficaces en anatomie.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-8 overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      className="rounded-full bg-white/90 p-2 text-brand-blue hover:bg-white"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const firstPreviewSection = courseSections.find(section => section.isPreview);
                        if (firstPreviewSection) {
                          handlePreviewClick(firstPreviewSection);
                        }
                      }}
                    >
                      <Play className="h-8 w-8" fill="currentColor" />
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-6 text-center">
                    <span className="text-3xl font-bold text-brand-blue">Gratuit</span>
                    <p className="text-sm text-gray-500">Offre à durée limitée</p>
                  </div>
                  <Button className="mb-4 w-full bg-brand-coral hover:bg-brand-coral/90">
                    S'inscrire Maintenant
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const firstPreviewSection = courseSections.find(section => section.isPreview);
                      if (firstPreviewSection) {
                        handlePreviewClick(firstPreviewSection);
                      }
                    }}
                  >
                    Aperçu du Cours
                  </Button>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-brand-teal" />
                      <span>Certificat de réussite</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-brand-teal" />
                      <span>Accès à vie</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-brand-teal" />
                      <span>Étudiez à votre rythme</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPreview?.title} - Aperçu du cours</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {selectedPreview?.videoUrl ? (
              <iframe 
                width="100%" 
                height="100%" 
                src={selectedPreview.videoUrl}
                title={`Aperçu de ${selectedPreview.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="aspect-video"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <p>Vidéo d'aperçu non disponible</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <p>Cet aperçu vous donne un bref aperçu du contenu de cette section du cours. Pour accéder au cours complet, veuillez vous inscrire.</p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="bg-brand-blue hover:bg-brand-blue/90">
              S'inscrire au cours
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CourseDetail;
