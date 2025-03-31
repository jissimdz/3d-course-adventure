
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, BookOpen } from "lucide-react";

export interface CourseProps {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessonCount: number;
  duration: string;
  thumbnailUrl: string;
}

const CourseCard: React.FC<CourseProps> = ({
  id,
  title,
  description,
  level,
  lessonCount,
  duration,
  thumbnailUrl,
}) => {
  const levelColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-blue-100 text-blue-800", // Changed back to blue
    Advanced: "bg-purple-100 text-purple-800",
  };

  const levelLabels = {
    Beginner: "Débutant",
    Intermediate: "Intermédiaire",
    Advanced: "Avancé",
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge
          className={`absolute right-2 top-2 ${levelColors[level]}`}
          variant="outline"
        >
          {levelLabels[level]}
        </Badge>
      </div>
      <CardHeader className="p-4 pb-0">
        <h3 className="text-xl font-semibold text-brand-blue">{title}</h3>
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-4 line-clamp-2 text-gray-600">{description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{lessonCount} leçons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          asChild
          className="w-full bg-brand-blue hover:bg-brand-dark-blue"
        >
          <Link to={`/course/${id}`}>Explorer le cours</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
