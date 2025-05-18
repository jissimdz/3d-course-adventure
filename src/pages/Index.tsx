import React from "react";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BadgeSystem from "@/components/BadgeSystem";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { courses } from "@/data/coursesData";
import CourseCard from "@/components/CourseCard";
import { BrainModel3D } from "@/components/brain-model";
import { Pencil } from "lucide-react";
const Index: React.FC = () => {
  // Only show the first 3 courses on the homepage
  const featuredCourses = courses.slice(0, 3);
  return <Layout>
      <HeroSection />
      <FeaturesSection />
      
      {/* Badge System */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-brand-blue md:text-4xl text-cyan-500">Récompense de progression</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Suivez votre progression et débloquez des récompenses en complétant diverses activités éducatives.
            </p>
          </div>
          <div className="mx-auto max-w-3xl">
            <BadgeSystem />
          </div>
        </div>
      </section>
      
      {/* Section pour l'éditeur de schémas */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-brand-blue md:text-4xl">
              Éditeur de Schémas Interactif
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Créez et exportez facilement des schémas personnalisés pour vos études ou présentations.
            </p>
            <Button asChild className="mt-6 bg-brand-teal hover:bg-brand-teal/90" size="lg">
              <Link to="/editor" className="flex items-center gap-2">
                <Pencil size={18} />
                Ouvrir l'Éditeur
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Nouvelle section de modèle 3D */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-brand-blue md:text-4xl">
              Explorez Notre Modèle 3D Interactif
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Découvrez l'anatomie du cerveau humain avec notre modèle 3D entièrement interactif. Faites tourner, zoomez et explorez les différentes parties pour une expérience d'apprentissage immersive.
            </p>
          </div>
          
          <div className="mx-auto max-w-4xl">
            <BrainModel3D />
          </div>
          
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10">
              <Link to="/course/brain-anatomy-101">En Savoir Plus</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Courses Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-brand-blue md:text-4xl">
              Cours Vedettes
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Commencez votre voyage dans l'apprentissage 3D interactif avec nos cours les plus populaires
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map(course => <CourseCard key={course.id} {...course} />)}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="border-brand-teal text-brand-teal hover:bg-brand-teal/10">
              <Link to="/courses">Voir Tous les Cours</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-brand-blue py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Prêt à Transformer Votre Expérience d'Apprentissage?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Rejoignez des milliers d'étudiants et de professionnels qui utilisent déjà notre plateforme d'apprentissage 3D pour améliorer leur compréhension de l'anatomie et des concepts biologiques et médicaux.
          </p>
          <Button asChild size="lg" className="mt-8 bg-brand-teal hover:bg-brand-teal/90">
            <Link to="/courses">Commencer Aujourd'hui</Link>
          </Button>
        </div>
      </section>
    </Layout>;
};
export default Index;