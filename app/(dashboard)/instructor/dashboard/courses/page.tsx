"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus, BookOpen, Edit, Trash2, Clock, Star, Users, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Module {
  id: string;
  name: string;
  contentType: string;
  duration: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  published?: boolean;
  modules?: Module[];
  students?: number;
  rating?: number;
  totalDuration?: string;
  totalModules?: number; // Add totalModules to the Course interface
  _count?: {
    modules?: number;
  };
}

export const dynamic = "force-static";

export default function InstructorCoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/courses?instructorId=${session?.user?.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        const enhancedCourses = data.courses.map((course: Course) => {
          // Calculate total duration
          const totalMinutes = course.modules?.reduce((sum, module) => {
            return sum + parseInt(module.duration) || 0;
          }, 0) || 0;
          
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          const totalDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

          const totalModules = course.modules?.length || 0; // Calculate total modules

          return {
            ...course,
            students: Math.floor(Math.random() * 1000),
            rating: (Math.random() * 1 + 4).toFixed(1),
            totalDuration,
            totalModules, // Add totalModules to the course object
          };
        });
        setCourses(enhancedCourses);
      } catch (error) {
        console.error("Error fetching instructor's courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchInstructorCourses();
    }
  }, [session?.user?.id, toast]);

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/courses/${courseId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to delete course");
        }
        setCourses(courses.filter(course => course.id !== courseId));
        toast({
          title: "Success",
          description: "Course deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting course:", error);
        toast({
          title: "Error",
          description: "Failed to delete course",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">
            Manage and organize your teaching materials
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/instructor/dashboard/courses/create">
            <Plus className="h-4 w-4 mr-2" /> Create New Course
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center p-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No courses created yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first course
          </p>
          <Button asChild>
            <Link href="/dashboard/instructor/dashboard/courses/create">
              Create Course
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-muted">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-r from-primary/10 to-secondary/10">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={course.published ? "default" : "secondary"}>
                    {course.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{course.students} students</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{course._count?.modules || 0} modules</span> {/* Display total modules using _count */}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{course.totalDuration || '0m'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2 border-t pt-4">
                <Button variant="outline" asChild className="flex-1">
                  <Link href={`/dashboard/instructor/dashboard/courses/edit?courseId=${course.id}`}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onClick={() => router.push(`/courses/${course.id}/modules/create`)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Module
                    </DropdownMenuItem>
                     <DropdownMenuItem 
                      onClick={() => router.push(`/courses/${course.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}