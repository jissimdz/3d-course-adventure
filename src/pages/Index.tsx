
import React from "react";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { courses } from "@/data/coursesData";
import CourseCard from "@/components/CourseCard";

const Index: React.FC = () => {
  // Only show the first 3 courses on the homepage
  const featuredCourses = courses.slice(0, 3);

  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      
      {/* Featured Courses Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-brand-blue md:text-4xl">
              Featured Courses
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Start your journey into interactive 3D learning with our most popular courses
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-brand-teal text-brand-teal hover:bg-brand-teal/10"
            >
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-brand-blue py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Join thousands of students and professionals who are already using our 3D learning platform
            to enhance their understanding of anatomy and medical concepts.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-brand-coral hover:bg-brand-coral/90"
          >
            <Link to="/courses">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
