
import React from "react";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { courses } from "@/data/coursesData";
import CourseCard from "@/components/CourseCard";

const Index: React.FC = () => {
  // Only show the first 3 courses on the homepage
  const featuredCourses = courses.slice(0, 3);

  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      
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
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-brand-teal text-brand-teal hover:bg-brand-teal/10"
            >
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
            Rejoignez des milliers d'étudiants et de professionnels qui utilisent déjà notre plateforme d'apprentissage 3D pour améliorer leur compréhension de l'anatomie et des concepts médicaux.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-brand-teal hover:bg-brand-teal/90"
          >
            <Link to="/courses">Commencer Aujourd'hui</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
