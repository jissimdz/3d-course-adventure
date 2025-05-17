
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Clock, BookOpen, Play, Puzzle } from "lucide-react";
import { CourseProps } from "@/components/CourseCard";
import { Link } from "react-router-dom";

interface CourseSidebarProps {
  course: CourseProps;
  onPreviewClick: () => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course, onPreviewClick }) => {
  return (
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
            onClick={onPreviewClick}
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
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onPreviewClick}
          >
            Aperçu du Cours
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-none border-brand-teal text-brand-teal hover:bg-brand-teal/10"
          >
            <Link to="/puzzle" className="flex items-center p-2">
              <Puzzle size={18} />
            </Link>
          </Button>
        </div>

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
  );
};

export default CourseSidebar;
