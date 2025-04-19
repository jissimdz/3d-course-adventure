import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Rotate3d, Play, Video } from "lucide-react";

interface CourseSection {
  id: number;
  title: string;
  duration: string;
  isPreview: boolean;
  videoUrl?: string;
  has3DModel?: boolean;
}

interface CourseCurriculumProps {
  courseSections: CourseSection[];
  course: {
    lessonCount: number;
    duration: string;
  };
  onPreviewClick: (section: CourseSection) => void;
  on3DModelClick: (section: CourseSection) => void;
}

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  courseSections,
  course,
  onPreviewClick,
  on3DModelClick,
}) => {
  const handleQuizStart = (sectionTitle: string) => {
    // Pour l'instant, on va juste faire défiler jusqu'à l'onglet Quiz
    const quizTab = document.querySelector('[value="quiz"]');
    if (quizTab) {
      (quizTab as HTMLElement).click();
    }
  };

  return (
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
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-semibold">{section.title}</h3>
                {section.isPreview && (
                  <Badge variant="outline" className="border-brand-teal text-brand-teal">
                    Cours vidéo
                  </Badge>
                )}
                {section.has3DModel && (
                  <Badge variant="outline" className="border-brand-blue text-brand-blue">
                    Modèle 3D
                  </Badge>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 text-brand-teal"
                  onClick={() => handleQuizStart(section.title)}
                >
                  <Play className="h-4 w-4" />
                  <span>Commencer le Quiz</span>
                </Button>
                {section.videoUrl && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 text-brand-blue"
                    onClick={() => onPreviewClick(section)}
                  >
                    <Video className="h-4 w-4" />
                    <span>Voir la vidéo</span>
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">{section.duration}</div>
                {section.isPreview && section.videoUrl && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 text-brand-blue"
                    onClick={() => onPreviewClick(section)}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Aperçu</span>
                  </Button>
                )}
                {section.has3DModel && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 text-brand-teal"
                    onClick={() => on3DModelClick(section)}
                  >
                    <Rotate3d className="h-4 w-4" />
                    <span>Modèle 3D</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCurriculum;
