
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
          <h1 className="text-4xl font-bold md:text-5xl">Explore Our Courses</h1>
          <p className="mx-auto mt-4 max-w-2xl">
            Discover our collection of interactive 3D courses designed to make learning anatomy and
            medical concepts engaging and effective.
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
                placeholder="Search courses..."
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
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
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
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
              <CourseGrid courses={filteredCourses} />
            </>
          ) : (
            <div className="py-16 text-center">
              <h3 className="text-xl font-semibold text-gray-700">No courses found</h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
