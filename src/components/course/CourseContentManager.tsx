
import React, { useState } from "react";
import { CourseSection } from "@/components/course/CourseSections";

interface CourseContentManagerProps {
  children: React.ReactNode;
}

interface CourseContentContextType {
  previewOpen: boolean;
  modelViewOpen: boolean;
  selectedPreview: { title: string; id: number; videoUrl?: string } | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setPreviewOpen: (open: boolean) => void;
  setModelViewOpen: (open: boolean) => void;
  setSelectedPreview: (preview: { title: string; id: number; videoUrl?: string } | null) => void;
  handlePreviewClick: (section: CourseSection) => void;
  handleSidebarPreviewClick: (courseSections: CourseSection[]) => void;
  handle3DModelClick: () => void;
}

export const CourseContentContext = React.createContext<CourseContentContextType | undefined>(undefined);

export const CourseContentManager: React.FC<CourseContentManagerProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [modelViewOpen, setModelViewOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<{ title: string; id: number; videoUrl?: string } | null>(null);

  const handlePreviewClick = (section: CourseSection) => {
    setSelectedPreview(section);
    setPreviewOpen(true);
  };

  const handleSidebarPreviewClick = (courseSections: CourseSection[]) => {
    const firstPreviewSection = courseSections.find(section => section.isPreview);
    if (firstPreviewSection) {
      if (firstPreviewSection.videoUrl) {
        handlePreviewClick(firstPreviewSection);
      } else if (firstPreviewSection.has3DModel) {
        setModelViewOpen(true);
      }
    }
  };

  const handle3DModelClick = () => {
    setModelViewOpen(true);
  };

  return (
    <CourseContentContext.Provider
      value={{
        previewOpen,
        modelViewOpen,
        selectedPreview,
        activeTab,
        setActiveTab,
        setPreviewOpen,
        setModelViewOpen,
        setSelectedPreview,
        handlePreviewClick,
        handleSidebarPreviewClick,
        handle3DModelClick
      }}
    >
      {children}
    </CourseContentContext.Provider>
  );
};

export const useCourseContent = () => {
  const context = React.useContext(CourseContentContext);
  if (context === undefined) {
    throw new Error('useCourseContent must be used within a CourseContentManager');
  }
  return context;
};
