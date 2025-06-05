"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Play, Clock, BookOpen, FileText, Award, ChevronDown, ChevronUp, User, CheckCircle, Star, Bookmark, Share2, Download, BarChart2, Calendar, HelpCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface Assignment {
  id: string;
  title: string;
  deadline: string;
  description?: string;
}

interface Video {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
  preview?: boolean;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  videos?: Video[];
  assignments?: Assignment[];
  resources?: number;
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
  rating?: number;
  students?: number;
  category?: string;
  level?: string;
  instructor?: {
    name: string;
    title: string;
    avatar?: string;
    bio?: string;
    ratings?: number;
    courses?: number;
  };
  requirements?: string[];
  learnings?: string[];
}

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: session } = useSession();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("curriculum");
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!id) {
      console.error("No course ID provided in route parameters");
      return;
    }

    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course details");
        const data = await res.json();
        
        if (data?.course) {
          setCourse({
            ...data.course,
            rating: data.course.rating || 4.7,
            students: data.course.students || 1243,
            category: data.course.category || "Web Development",
            level: data.course.level || "Intermediate",
            requirements: data.course.requirements || [
              "Basic programming knowledge",
              "Computer with internet access",
              "Willingness to learn"
            ],
            learnings: data.course.learnings || [
              "Build full-stack applications",
              "Master modern frameworks",
              "Deploy production-ready apps",
              "Implement best practices"
            ],
            instructor: {
              name: data.course.instructor?.name || "Instructor Unknown",
              title: data.course.instructor?.title || "Senior Developer",
              avatar: data.course.instructor?.avatar || "https://randomuser.me/api/portraits/men/32.jpg",
              bio: data.course.instructor?.bio || "10+ years of industry experience building scalable web applications for Fortune 500 companies.",
              ratings: data.course.instructor?.ratings || 482,
              courses: data.course.instructor?.courses || 7
            }
          });

          // Initialize expanded modules state
          const initialExpandedState: Record<string, boolean> = {};
          data.course.modules?.forEach((module: Module) => {
            initialExpandedState[module.id] = false;
          });
          setExpandedModules(initialExpandedState);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchCourseDuration = async () => {
      try {
        const res = await fetch(`/api/courses/${id}/duration`);
        if (!res.ok) throw new Error("Failed to fetch course duration");
        const data = await res.json();
        setCourse((prev) => (prev ? { ...prev, duration: data.totalDuration } : null));
      } catch (error) {
        console.error("Error fetching course duration:", error);
      }
    };

    fetchCourseDuration();
  }, [id]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(`/api/courses/${id}/modules`);
        if (!res.ok) throw new Error("Failed to fetch modules");
        const data = await res.json();
        setCourse((prev) => (prev ? { ...prev, modules: data.modules } : null));
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, [id]);

  const fetchModuleContent = async (moduleId: string) => {
    try {
      const res = await fetch(`/api/courses/${id}/modules/${moduleId}`);
      if (!res.ok) throw new Error("Failed to fetch module content");
      const data = await res.json();
      setExpandedModules((prev) => ({
        ...prev,
        [moduleId]: !prev[moduleId],
      }));
      setCourse((prev) => {
        if (!prev) return null;
        const updatedModules = prev.modules.map((module) =>
          module.id === moduleId ? { ...module, content: data.content } : module
        );
        return { ...prev, modules: updatedModules };
      });
    } catch (error) {
      console.error("Error fetching module content:", error);
    }
  };

  const toggleModule = async (moduleId: string) => {
    try {
      const res = await fetch(`/api/courses/${id}/modules/${moduleId}`);
      if (!res.ok) throw new Error("Failed to fetch module content");
      const data = await res.json();

      setExpandedModules((prev) => ({
        ...prev,
        [moduleId]: !prev[moduleId],
      }));

      setCourse((prev) => {
        if (!prev) return null;
        const updatedModules = prev.modules.map((module) =>
          module.id === moduleId ? { ...module, videos: data.videos } : module
        );
        return { ...prev, modules: updatedModules };
      });
    } catch (error) {
      console.error("Error fetching module content:", error);
    }
  };

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course details");
        const data = await res.json();

        if (data?.course?.instructors?.length > 0) {
          const instructor = data.course.instructors[0];
          setCourse((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              instructor: {
                name: instructor.name,
                title: "Instructor", // Default title as it's not in the response
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=random`,
                bio: "", // Default bio as it's not in the response
                ratings: 0, // Default ratings as it's not in the response
                courses: 0, // Default courses as it's not in the response
              },
            };
          });
        }
      } catch (error) {
        console.error("Error fetching instructor details:", error);
      }
    };

    fetchInstructorDetails();
  }, [id]);

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
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Course Header Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Left Column - Course Thumbnail */}
        <div className="w-full lg:w-1/2">
          <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
            <img
              src={course.thumbnail || "https://source.unsplash.com/random/800x450/?course,education"}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent flex items-end p-6">
              <div className="flex items-center gap-3">
                <Button className="bg-white text-primary hover:bg-white/90 shadow-lg px-6 py-3">
                  <Play className="mr-2 h-5 w-5" /> Preview Course
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="bg-white/90 hover:bg-white text-gray-700 shadow-lg"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white text-gray-700 shadow-lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-white/90 backdrop-blur text-gray-800">
                {course.category}
              </Badge>
            </div>
          </div>

          {/* Course Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Star className="h-5 w-5 fill-primary" />
                <span className="font-bold">{course.rating}</span>
              </div>
              <p className="text-xs text-gray-500">Course Rating</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
              <div className="font-bold text-primary mb-1">{course.lectures}</div>
              <p className="text-xs text-gray-500">Lectures</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
              <div className="font-bold text-primary mb-1">{course.students}+</div>
              <p className="text-xs text-gray-500">Students</p>
            </div>
          </div>
        </div>

        {/* Right Column - Course Details */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="outline" className="mb-3 bg-primary/10 text-primary">
                {course.level} Level
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{course.description}</p>
            </div>
          </div>

          {/* Instructor Card */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center gap-4 pb-3">
              <Avatar>
                <AvatarImage src={course.instructor?.avatar} />
                <AvatarFallback>{course.instructor?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{course.instructor?.name}</h3>
                <p className="text-sm text-gray-600">{course.instructor?.title}</p>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700 mb-3">{course.instructor?.bio}</p>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1 text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  {course.instructor?.ratings} ratings
                </span>
                <span className="flex items-center gap-1 text-gray-600">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {course.instructor?.courses} courses
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Progress & Enrollment */}
          {course.progress !== undefined ? (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-800">Your Progress</h4>
                <span className="font-medium text-primary">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
              <Button className="w-full mt-4 py-3 text-md font-medium">
                Continue Learning
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button className="w-full py-3 text-md font-medium shadow-md hover:shadow-lg transition-all">
                Enroll Now - $99.99
              </Button>
              <div className="text-center text-sm text-gray-500">
                30-Day Money-Back Guarantee
              </div>
            </div>
          )}

          {/* Quick Facts */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span>{assignments.length} Assignments</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Download className="h-4 w-4 text-primary" />
              <span>Downloadable Resources</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-primary" />
              <span>Certificate of Completion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-50 h-12">
          <TabsTrigger 
            value="curriculum" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <BookOpen className="h-4 w-4 mr-2" /> Curriculum
          </TabsTrigger>
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <BarChart2 className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger 
            value="instructor" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <User className="h-4 w-4 mr-2" /> Instructor
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Star className="h-4 w-4 mr-2" /> Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="mt-6">
          {/* Curriculum Section */}
          <div className="border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-white px-6 py-4 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Course Curriculum
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {modules.length} modules • {videos.length} lectures • {course.duration} total length
              </p>
            </div>
            
            <div className="divide-y">
              {modules.map((module) => (
                <div key={module.id} className="bg-white">
                  <button
                    className={`w-full flex justify-between items-center px-6 py-4 text-left transition-colors ${
                      expandedModules[module.id] ? 'bg-primary/5' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedModules[module.id] ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-primary" />
                      )}
                      <div>
                        <span className="font-medium text-gray-800">{module.title}</span>
                        {module.description && (
                          <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {module.videos?.length ?? 0} lessons
                      </span>
                      {module.resources && (
                        <span className="text-sm text-gray-500">
                          {module.resources} resources
                        </span>
                      )}
                    </div>
                  </button>
                  
                  {expandedModules[module.id] && (
                    <div className="bg-gray-50/50 px-6 py-3">
                      <div className="space-y-2">
                        {module.videos?.map((video) => (
                          <div 
                            key={video.id} 
                            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                              hoveredItem === `video-${video.id}` 
                                ? 'bg-white shadow-sm border' 
                                : 'bg-transparent'
                            }`}
                            onMouseEnter={() => setHoveredItem(`video-${video.id}`)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <div className="flex items-center gap-3">
                              {video.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Play className="h-5 w-5 text-primary" />
                              )}
                              <div>
                                <span className={`text-sm font-medium ${
                                  video.completed ? 'text-gray-500' : 'text-gray-700'
                                }`}>
                                  {video.title}
                                </span>
                                {video.preview && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    Preview
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500">{video.duration}</span>
                              {hoveredItem === `video-${video.id}` && (
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          {/* Overview Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Modules</h2>
            {modules.length > 0 ? (
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800">{module.title}</h3>
                    {module.description && (
                      <p className="text-sm text-gray-600 mt-2">{module.description}</p>
                    )}
                    <div className="mt-4 space-y-2">
                      {module.videos?.length > 0 && (
                        <div>
                          <h4 className="text-md font-medium text-gray-700">Videos</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {module.videos?.map((video) => (
                              <li key={video.id} className="flex justify-between">
                                <span>{video.title}</span>
                                <span>{video.duration}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {module.resources && (
                        <div>
                          <h4 className="text-md font-medium text-gray-700">Resources</h4>
                          <p className="text-sm text-gray-600">{module.resources} downloadable resources</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No modules available for this course.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="instructor" className="mt-6">
          {/* Instructor Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                About the Instructor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={course.instructor?.avatar} />
                    <AvatarFallback>{course.instructor?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{course.instructor?.name}</h3>
                  <p className="text-primary mb-3">{course.instructor?.title}</p>
                  <p className="text-gray-700 mb-4">{course.instructor?.bio}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span>{course.instructor?.ratings} reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span>{course.instructor?.courses} courses</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Student Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">{course.rating}</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(course.rating!) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-500">Course Rating</p>
                  </div>
                </div>
                <div className="md:w-2/3 space-y-6">
                  {/* Sample Review */}
                  <div className="border-b pb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">Jane Doe</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < 5 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">
                      This course exceeded my expectations! The instructor explains complex concepts in a way that's easy to understand. The projects were challenging but rewarding.
                    </p>
                    <p className="text-sm text-gray-500">2 weeks ago</p>
                  </div>
                  
                  {/* Add Review Form */}
                  <div className="pt-4">
                    <h4 className="font-medium mb-3">Leave a Review</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">Rating:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-5 w-5 text-gray-300 hover:text-yellow-500 hover:fill-yellow-500 cursor-pointer"
                            />
                          ))}
                        </div>
                      </div>
                      <Input placeholder="Title your review" />
                      <Textarea placeholder="Share your experience" rows={3} />
                      <Button className="w-full md:w-auto">Submit Review</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}