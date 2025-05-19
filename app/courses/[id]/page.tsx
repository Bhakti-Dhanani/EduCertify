"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Play, Clock, BookOpen, FileText, Award, ChevronDown, ChevronUp, User, CheckCircle, MoreVertical } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Assignment {
  id: string;
  title: string;
  deadline: string;
}

interface Video {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  videos?: Video[];
  assignments?: Assignment[];
}

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  lectures: number;
  assignments: Assignment[];
  videos: Video[];
  modules: Module[];
  progress?: number;
  instructor?: {
    name: string;
    title: string;
    avatar?: string;
    bio?: string; // Added bio as an optional property
  };
}

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: session } = useSession();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleFile, setNewModuleFile] = useState<File | null>(null);
  const [newModuleContentType, setNewModuleContentType] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!id) {
      console.error("No course ID provided in route parameters");
      return;
    }

    fetch(`/api/courses/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch course details");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.course) {
          setCourse(data.course);
          const initialExpandedState: Record<string, boolean> = {};
          data.course.modules?.forEach((module: Module) => {
            initialExpandedState[module.id] = false;
          });
          setExpandedModules(initialExpandedState);
        } else {
          setCourse(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
        setCourse(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Add module handler
  const handleAddModule = async () => {
    if (!newModuleName || !newModuleFile) return;
    const formData = new FormData();
    formData.append("name", newModuleName);
    formData.append("file", newModuleFile);
    formData.append("contentType", newModuleContentType);
    await fetch(`/api/courses/${id}/modules`, {
      method: "POST",
      body: formData,
    });
    setShowAddModule(false);
    setNewModuleName("");
    setNewModuleFile(null);
    setNewModuleContentType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    // Optionally, refresh modules list
    window.location.reload();
  };

  // Ensure delete course functionality is correctly implemented
  const handleDeleteCourse = async () => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/courses/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to delete course");
        }
        alert("Course deleted successfully.");
        window.location.href = "/dashboard/instructor/courses"; // Redirect to courses list
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("An error occurred while deleting the course.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Course not found</h1>
        <p className="text-gray-600 mt-2">The requested course could not be loaded.</p>
      </div>
    );
  }

  const assignments = course.assignments || [];
  const videos = course.videos || [];
  const modules = course.modules || [];

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      {/* Course Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Image and Features Side by Side */}
        <div className="w-full md:w-2/5 flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-xl shadow-md aspect-video bg-gray-100">
            <img
              src={course.thumbnail || "https://via.placeholder.com/800x450"}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-4">
              <Button className="bg-white text-primary hover:bg-white/90 shadow-lg">
                <Play className="mr-2 h-4 w-4" /> Preview
              </Button>
            </div>
          </div>
          {/* Course Features beside the image */}
          <div className="border rounded-lg overflow-hidden mt-4 md:mt-0">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-medium">Course Features</h3>
            </div>
            <div className="p-4 bg-white">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <Play className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{course.lectures} Video Lectures</p>
                    <p className="text-xs text-gray-500">HD quality content</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{assignments.length} Practical Assignments</p>
                    <p className="text-xs text-gray-500">Hands-on exercises</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{course.duration} Total Duration</p>
                    <p className="text-xs text-gray-500">Self-paced learning</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Award className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Certificate of Completion</p>
                    <p className="text-xs text-gray-500">Shareable credential</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Details below the image */}
        <div className="w-full md:w-3/5 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Play className="h-4 w-4" />
              <span>{course.lectures} Lectures</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>Certificate</span>
            </Badge>
          </div>
          {course.progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Progress</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          )}
          <Button className="w-full md:w-auto px-6 py-3 text-md font-medium shadow-md hover:shadow-lg transition-shadow mb-4">
            Enroll Now
          </Button>
          {/* Instructor Info */}
          <div className="border rounded-lg overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-medium">Instructor</h3>
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{course.instructor?.name || "Expert Instructor"}</h4>
                  <p className="text-xs text-gray-500">{course.instructor?.title || "Industry Professional"}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {course.instructor?.bio
                  ? course.instructor.bio
                  : "Our instructors are industry experts with years of practical experience in their fields."}
              </p>
            </div>
          </div>
          {/* Fill blank space with a testimonial card */}
          <div className="border rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-6 flex flex-col items-center justify-center shadow-sm">
            <svg className="h-8 w-8 text-primary mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h7l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
            <p className="text-md text-gray-700 italic text-center mb-2">“This course transformed my career! The content is practical, up-to-date, and the instructor support is amazing.”</p>
            <span className="text-xs text-gray-500 mb-4">— Satisfied Student</span>
            <Button className="mt-2" variant="outline">Add Comment</Button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Course Curriculum */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Course Curriculum
              </h2>
            </div>
            <div className="divide-y">
              {modules.map((module) => (
                <div key={module.id} className="bg-white">
                  <button
                    className={`w-full flex justify-between items-center px-5 py-3 text-left transition-colors ${expandedModules[module.id] ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedModules[module.id] ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-primary" />
                      )}
                      <span className="font-medium text-gray-800">{module.title}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {module.videos?.length || 0} Lessons
                    </span>
                  </button>
                  {expandedModules[module.id] && (
                    <div className="bg-gray-50/50">
                      {module.description && (
                        <div className="px-5 py-3 text-sm text-gray-600">
                          {module.description}
                        </div>
                      )}
                      <div className="pb-2">
                        {module.videos?.map((video: any) => (
                          <div 
                            key={video.id} 
                            className={`flex items-center justify-between px-5 py-2.5 mx-2 rounded transition-colors ${hoveredItem === `video-${video.id}` ? 'bg-white shadow-sm' : ''}`}
                            onMouseEnter={() => setHoveredItem(`video-${video.id}`)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <div className="flex items-center gap-3">
                              {video.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Play className="h-4 w-4 text-primary" />
                              )}
                              <span className={`text-sm ${video.completed ? 'text-gray-500' : 'text-gray-700'}`}>{video.title || video.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{video.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* What You'll Learn */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b">
              <h2 className="text-xl font-semibold">What You'll Learn</h2>
            </div>
            <div className="p-5 bg-white">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assignments.map((assignment) => (
                  <li 
                    key={assignment.id} 
                    className="flex items-start gap-2.5 hover:bg-gray-50 px-3 py-2 rounded transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span className="text-sm text-gray-700">{assignment.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Sidebar CTA */}
        <div className="space-y-4">
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Start Learning Today</h3>
            <p className="text-sm text-gray-600 mb-4">
              Join thousands of students who have already transformed their careers with this course.
            </p>
            <Button className="w-full py-2.5 text-md font-medium shadow-sm hover:shadow-md transition-shadow">
              Enroll Now
            </Button>
          </div>
        </div>
      </div>
     
    </div>
  );
}