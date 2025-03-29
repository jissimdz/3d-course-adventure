
import React from "react";
import { Brain, Book, PanelTop, Workflow } from "lucide-react";

const features = [
  {
    icon: <Brain className="h-10 w-10" />,
    title: "Modèles 3D Interactifs",
    description:
      "Explorez les structures anatomiques détaillées avec des modèles 3D entièrement interactifs que vous pouvez faire pivoter, zoomer et disséquer.",
  },
  {
    icon: <Book className="h-10 w-10" />,
    title: "Cours Complets",
    description:
      "Apprenez avec des cours structurés conçus par des professionnels médicaux et des éducateurs pour une rétention maximale.",
  },
  {
    icon: <PanelTop className="h-10 w-10" />,
    title: "Suivi de Progression",
    description:
      "Suivez votre progression d'apprentissage avec des statistiques détaillées et des réalisations pour rester motivé.",
  },
  {
    icon: <Workflow className="h-10 w-10" />,
    title: "Quiz Interactifs",
    description:
      "Testez vos connaissances avec des quiz interactifs qui s'adaptent à votre style d'apprentissage et à vos progrès.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-brand-blue md:text-4xl">
            Fonctionnalités qui Transforment l'Apprentissage
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Notre plateforme combine une technologie de pointe avec une conception pédagogique experte pour créer une expérience d'apprentissage immersive.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-gradient rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-4 text-brand-teal">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-brand-blue">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
