
import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCourseById } from "@/data/coursesData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Award, Check } from "lucide-react";
import { Card } from "@/components/ui/card";

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  
  const course = courseId ? getCourseById(courseId) : null;
  
  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  // Mock data for course sections
  const courseSections = [
    {
      id: 1,
      title: "Introduction to the Course",
      duration: "15 min",
      isPreview: true,
    },
    {
      id: 2,
      title: `Basic ${course.title} Concepts`,
      duration: "30 min",
      isPreview: false,
    },
    {
      id: 3,
      title: "Interactive 3D Exploration",
      duration: "45 min",
      isPreview: false,
    },
    {
      id: 4,
      title: "Key Structures and Functions",
      duration: "60 min",
      isPreview: false,
    },
    {
      id: 5,
      title: "Quiz and Assessment",
      duration: "20 min",
      isPreview: false,
    },
  ];

  // Mock learning outcomes
  const learningOutcomes = [
    `Understand the fundamental components of ${course.title.toLowerCase()}`,
    "Navigate and manipulate 3D models to explore anatomical structures",
    `Identify key elements and their functions within ${course.title.toLowerCase()}`,
    "Apply knowledge through interactive quizzes and assessments",
    "Relate anatomical structures to their physiological functions",
  ];

  return (
    <Layout>
      {/* Course Header */}
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
            {course.level}
          </Badge>
          <h1 className="text-4xl font-bold md:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-lg">{course.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>{course.lessonCount} lessons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Main Content */}
            <div className="md:col-span-2">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-brand-blue">
                        About This Course
                      </h2>
                      <p className="mt-3 text-gray-700">
                        This comprehensive course takes you on a journey through {course.title.toLowerCase()}, 
                        using cutting-edge 3D visualization technology to make complex concepts easy to 
                        understand. Whether you're a medical student, healthcare professional, or simply 
                        curious about human anatomy, this course will provide valuable insights and 
                        knowledge.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-brand-blue">
                        What You'll Learn
                      </h2>
                      <ul className="mt-3 space-y-2">
                        {learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <Check className="h-5 w-5 shrink-0 text-green-500" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-brand-blue">
                        Requirements
                      </h2>
                      <ul className="mt-3 list-disc pl-5 text-gray-700">
                        <li>No prior knowledge required - suitable for beginners</li>
                        <li>A modern web browser that supports 3D graphics</li>
                        <li>Interest in learning about human anatomy and physiology</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="curriculum">
                  <div>
                    <h2 className="text-2xl font-semibold text-brand-blue">
                      Course Curriculum
                    </h2>
                    <p className="mt-2 text-gray-600">
                      {courseSections.length} sections • {course.lessonCount} lessons • {course.duration} total length
                    </p>
                    
                    <div className="mt-6 space-y-4">
                      {courseSections.map((section) => (
                        <div key={section.id} className="rounded-md border border-gray-200 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {section.isPreview ? (
                                <Badge variant="outline" className="border-brand-teal text-brand-teal">
                                  Preview
                                </Badge>
                              ) : null}
                              <h3 className="font-semibold">{section.title}</h3>
                            </div>
                            <div className="text-sm text-gray-500">{section.duration}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="instructor">
                  <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
                    <div className="h-32 w-32 overflow-hidden rounded-full">
                      <img
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                        alt="Instructor"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-brand-blue">
                        Dr. Jane Smith
                      </h2>
                      <p className="text-brand-teal">Medical Education Specialist</p>
                      <p className="mt-4 text-gray-700">
                        Dr. Jane Smith is a renowned medical educator with over 15 years of 
                        experience teaching anatomy and physiology. She has developed numerous 
                        innovative approaches to medical education, with a focus on using 
                        3D visualization technology to enhance understanding of complex anatomical 
                        structures.
                      </p>
                      <p className="mt-3 text-gray-700">
                        She holds a Ph.D. in Medical Education from Harvard University and 
                        has published extensively on effective teaching methods in anatomy.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-8 overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-6 text-center">
                    <span className="text-3xl font-bold text-brand-blue">Free</span>
                    <p className="text-sm text-gray-500">Limited time offer</p>
                  </div>
                  <Button className="mb-4 w-full bg-brand-coral hover:bg-brand-coral/90">
                    Enroll Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Preview Course
                  </Button>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-brand-teal" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-brand-teal" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-brand-teal" />
                      <span>Study at your own pace</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetail;
