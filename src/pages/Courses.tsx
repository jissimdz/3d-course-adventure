
import React, { useState } from "react";
import Layout from "@/components/Layout";
import CourseGrid from "@/components/CourseGrid";
import { courses } from "@/data/coursesData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === "all" || course.level.toLowerCase() === levelFilter.toLowerCase();
    
    return matchesSearch && matchesLevel;
  });

  return (
    <Layout>
      {/* Header */}
      <div className="bg-brand-blue py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Explorez Nos Cours</h1>
          <p className="mx-auto mt-4 max-w-2xl">
            Découvrez notre collection de cours 3D interactifs conçus pour rendre l'apprentissage de l'anatomie et des concepts médicaux engageant et efficace.
          </p>
        </div>
      </div>

      {/* Filters */}
      <section className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher des cours..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={levelFilter}
                onValueChange={setLevelFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Niveaux</SelectItem>
                  <SelectItem value="débutant">Débutant</SelectItem>
                  <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                  <SelectItem value="avancé">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {filteredCourses.length > 0 ? (
            <>
              <p className="mb-6 text-gray-600">
                Affichage de {filteredCourses.length} sur {courses.length} cours
              </p>
              <CourseGrid courses={filteredCourses} />
            </>
          ) : (
            <div className="py-16 text-center">
              <h3 className="text-xl font-semibold text-gray-700">Aucun cours trouvé</h3>
              <p className="mt-2 text-gray-500">
                Essayez d'ajuster votre recherche ou votre filtre pour trouver ce que vous cherchez.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
