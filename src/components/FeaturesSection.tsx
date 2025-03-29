
import React from "react";
import { Brain, Book, PanelTop, Workflow } from "lucide-react";

const features = [
  {
    icon: <Brain className="h-10 w-10" />,
    title: "Interactive 3D Models",
    description:
      "Explore detailed anatomical structures with fully interactive 3D models that you can rotate, zoom, and dissect.",
  },
  {
    icon: <Book className="h-10 w-10" />,
    title: "Comprehensive Courses",
    description:
      "Learn with structured courses designed by medical professionals and educators for maximum retention.",
  },
  {
    icon: <PanelTop className="h-10 w-10" />,
    title: "Progress Tracking",
    description:
      "Monitor your learning progress with detailed statistics and achievements to keep you motivated.",
  },
  {
    icon: <Workflow className="h-10 w-10" />,
    title: "Interactive Quizzes",
    description:
      "Test your knowledge with interactive quizzes that adapt to your learning style and progress.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-brand-blue md:text-4xl">
            Features That Transform Learning
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Our platform combines cutting-edge technology with expert educational design to create
            an immersive learning experience.
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
