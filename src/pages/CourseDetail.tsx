
import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCourseById } from "@/data/coursesData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Award, Check } from "lucide-react";
import { Card } from "@/components/ui/card";

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  
  const course = courseId ? getCourseById(courseId) : null;
  
  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  // Mock data for course sections
  const courseSections = [
    {
      id: 1,
      title: "Introduction au Cours",
      duration: "15 min",
      isPreview: true,
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

  // Mock learning outcomes
  const learningOutcomes = [
    `Comprendre les composants fondamentaux de ${course.title.toLowerCase()}`,
    "Naviguer et manipuler des modèles 3D pour explorer les structures anatomiques",
    `Identifier les éléments clés et leurs fonctions dans ${course.title.toLowerCase()}`,
    "Appliquer les connaissances à travers des quiz interactifs et des évaluations",
    "Établir des liens entre les structures anatomiques et leurs fonctions physiologiques",
  ];

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
                course.level === "Débutant"
                  ? "#84cc16"
                  : course.level === "Intermédiaire"
                  ? "#3b82f6"
                  : "#a855f7",
            }}
          >
            {course.level}
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
                              {section.isPreview ? (
                                <Badge variant="outline" className="border-brand-teal text-brand-teal">
                                  Aperçu
                                </Badge>
                              ) : null}
                              <h3 className="font-semibold">{section.title}</h3>
                            </div>
                            <div className="text-sm text-gray-500">{section.duration}</div>
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
                        Dr. Marie Dupont
                      </h2>
                      <p className="text-brand-teal">Spécialiste en Éducation Médicale</p>
                      <p className="mt-4 text-gray-700">
                        Dr. Marie Dupont est une éducatrice médicale renommée avec plus de 15 ans 
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
                </div>
                <div className="p-6">
                  <div className="mb-6 text-center">
                    <span className="text-3xl font-bold text-brand-blue">Gratuit</span>
                    <p className="text-sm text-gray-500">Offre à durée limitée</p>
                  </div>
                  <Button className="mb-4 w-full bg-brand-coral hover:bg-brand-coral/90">
                    S'inscrire Maintenant
                  </Button>
                  <Button variant="outline" className="w-full">
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
    </Layout>
  );
};

export default CourseDetail;
