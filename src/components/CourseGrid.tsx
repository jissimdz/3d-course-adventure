
import React from "react";
import CourseCard, { CourseProps } from "./CourseCard";

interface CourseGridProps {
  courses: CourseProps[];
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses }) => {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
};

export default CourseGrid;
