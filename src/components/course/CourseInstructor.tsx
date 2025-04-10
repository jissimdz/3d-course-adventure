
import React from "react";

const CourseInstructor: React.FC = () => {
  return (
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
          Dr. Souttou est une éducatrice biologique et médicale renommée avec plus de 15 ans 
          d'expérience dans l'enseignement de l'anatomie et de la physiologie. Elle a 
          développé de nombreuses approches innovantes pour l'éducation biologique et médicale, en 
          se concentrant sur l'utilisation de la technologie de visualisation 3D pour 
          améliorer la compréhension des structures anatomiques complexes.
        </p>
        <p className="mt-3 text-gray-700">
          Elle détient un doctorat en Éducation Biologique et Médicale de l'Université de Paris et 
          a beaucoup publié sur les méthodes d'enseignement efficaces en anatomie.
        </p>
      </div>
    </div>
  );
};

export default CourseInstructor;
