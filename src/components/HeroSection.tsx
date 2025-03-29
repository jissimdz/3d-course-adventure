
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-gradient py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-brand-blue md:text-5xl lg:text-6xl">
              Apprenez l'Anatomie en <span className="text-brand-teal">3D</span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-gray-600">
              Explorez des modèles 3D détaillés et des cours interactifs conçus pour rendre l'anatomie et l'éducation médicale engageantes et efficaces.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-brand-blue text-white hover:bg-brand-blue/90"
              >
                <Link to="/courses">Explorer les Cours</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-brand-teal text-brand-teal hover:bg-brand-teal/10"
              >
                <Link to="/about">En Savoir Plus</Link>
              </Button>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative h-80 w-80 animate-float md:h-96 md:w-96">
              {/* Placeholder for 3D model - in a real implementation this would be a Three.js component */}
              <div className="absolute inset-0 rounded-full bg-blue-100 opacity-50 blur-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-64 animate-rotate-slow rounded-full border-4 border-blue-200 border-opacity-50">
                  <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-brand-teal"></div>
                </div>
                <div className="h-48 w-48 animate-rotate-slow rounded-full border-4 border-teal-200 border-opacity-50">
                  <div className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-brand-coral"></div>
                </div>
                <div className="absolute flex h-40 w-40 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur">
                  <span className="text-6xl font-bold text-brand-blue">3D</span>
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
