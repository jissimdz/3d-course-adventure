
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";
import { CourseProps } from "@/components/CourseCard";

interface CourseHeaderProps {
  course: CourseProps;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ course }) => {
  return (
    <div
      className="relative bg-cover bg-center py-20 text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${course.thumbnailUrl})`,
      }}
    >
      <div className="container mx-auto px-4">
        <Badge
          className="mb-4"
          style={{
            backgroundColor:
              course.level === "Beginner"
                ? "#84cc16"
                : course.level === "Intermediate"
                ? "#3b82f6"
                : "#a855f7",
          }}
        >
          {course.level === "Beginner" ? "Débutant" : course.level === "Intermediate" ? "Intermédiaire" : "Avancé"}
        </Badge>
        <h1 className="text-4xl font-bold md:text-5xl">BAC 2025</h1>
        <p className="mt-4 max-w-2xl text-lg">{course.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span>{course.lessonCount} leçons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
