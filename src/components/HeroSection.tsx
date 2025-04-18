
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-gradient py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-brand-dark-blue md:text-5xl lg:text-6xl">
              Plongez dans l'<span className="text-brand-blue">Apprentissage</span> Visuel et Interactif
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-gray-600">
              Explorez des modèles 3D interactifs, des vidéos explicatives claires et des quiz ludiques pour rendre l'apprentissage de l'anatomie, de la biologie et de la médecine plus accessible, engageant et efficace.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-brand-blue text-white hover:bg-brand-dark-blue"
              >
                <Link to="/courses">Explorer les Cours</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue/10"
              >
                <Link to="/about">En Savoir Plus</Link>
              </Button>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative h-80 w-80 animate-float md:h-96 md:w-96">
              <div className="absolute inset-0 rounded-full bg-blue-100 opacity-50 blur-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-64 animate-rotate-slow rounded-full border-4 border-blue-200 border-opacity-50">
                  <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-brand-blue"></div>
                </div>
                <div className="h-48 w-48 animate-rotate-slow rounded-full border-4 border-cyan-200 border-opacity-50">
                  <div className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-brand-teal"></div>
                </div>
                <div className="absolute flex h-40 w-40 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur">
                  <img 
                    src="/lovable-uploads/4edc6e70-3375-4492-813c-ce1104349b42.png"
                    alt="Erudys Logo"
                    className="h-24 w-24 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

