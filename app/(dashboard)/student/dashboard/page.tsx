import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, Calendar, FileText, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Student Dashboard | Learning Platform",
  description: "Student dashboard for the Learning Platform",
};

export default function StudentDashboardPage() {
  // Mock data for enrolled courses
  const enrolledCourses = [
    {
      id: "1",
      title: "Web Development Fundamentals",
      instructor: "John Smith",
      progress: 75,
      nextLesson: "CSS Layouts and Positioning",
      thumbnail: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: "2",
      title: "JavaScript Essentials",
      instructor: "Sarah Johnson",
      progress: 42,
      nextLesson: "Working with Arrays and Objects",
      thumbnail: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: "3",
      title: "React for Beginners",
      instructor: "Michael Brown",
      progress: 10,
      nextLesson: "Understanding JSX",
      thumbnail: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  // Mock data for upcoming assignments
  const upcomingAssignments = [
    {
      id: "1",
      title: "Portfolio Project",
      course: "Web Development Fundamentals",
      dueDate: "Tomorrow, 11:59 PM",
      status: "not-started",
    },
    {
      id: "2",
      title: "JavaScript Challenge",
      course: "JavaScript Essentials",
      dueDate: "In 3 days",
      status: "in-progress",
    },
    {
      id: "3",
      title: "Component Architecture Quiz",
      course: "React for Beginners",
      dueDate: "Next week",
      status: "not-started",
    },
  ];

  // Mock data for certificates
  const certificates = [
    {
      id: "1",
      title: "Introduction to Programming",
      issueDate: "2 months ago",
      instructor: "Robert Davis",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Continue your learning journey.
        </p>
      </div>

      {/* Progress overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Progress</CardTitle>
          <CardDescription>
            Track your overall progress across all courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                  <span>Enrolled Courses</span>
                </div>
                <span className="font-medium">3 of 3</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Completed Assignments</span>
                </div>
                <span className="font-medium">7 of 12</span>
              </div>
              <Progress value={58} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-green-500" />
                  <span>Earned Certificates</span>
                </div>
                <span className="font-medium">1 of 3</span>
              </div>
              <Progress value={33} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrolled courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Courses</h2>
          <Link href="/student/courses" className="text-sm text-primary hover:underline">
            View all courses
          </Link>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video w-full relative">
                <img 
                  src={course.thumbnail}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <Progress value={course.progress} className="h-1.5 w-3/4 bg-white/20" />
                    <span className="text-xs text-white font-medium">{course.progress}%</span>
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.instructor}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">
                  <span className="font-medium">Next up:</span> {course.nextLesson}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/courses/${course.id}`}>Continue Learning</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>
              Assignments and quizzes that need your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-start justify-between pb-4 last:pb-0 last:border-0 border-b">
                  <div>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        assignment.status === 'in-progress' 
                          ? 'bg-amber-500' 
                          : 'bg-red-500'
                      }`} />
                      <Link 
                        href={`/student/assignments/${assignment.id}`}
                        className="font-medium hover:underline"
                      >
                        {assignment.title}
                      </Link>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {assignment.course}
                    </p>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span className={`${
                      assignment.dueDate.includes('Tomorrow') 
                        ? 'text-amber-600 dark:text-amber-400' 
                        : ''
                    }`}>
                      {assignment.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/student/assignments">View All Assignments</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Certificates and achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Certificates & Achievements</CardTitle>
            <CardDescription>
              Your earned certificates and badges
            </CardDescription>
          </CardHeader>
          <CardContent>
            {certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="flex items-start justify-between pb-4 last:pb-0 last:border-0 border-b">
                    <div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-amber-500" />
                        <span className="font-medium">{certificate.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Instructor: {certificate.instructor}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {certificate.issueDate}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 mx-auto text-muted-foreground/60" />
                <p className="mt-4 text-muted-foreground">
                  Complete courses to earn certificates
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/student/certificates">View All Certificates</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recommended courses */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended For You</CardTitle>
          <CardDescription>
            Based on your learning activities and interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-md border p-3 hover:bg-accent/50 transition-colors">
              <div className="flex flex-col space-y-1.5">
                <h3 className="font-semibold">Advanced React Patterns</h3>
                <p className="text-sm text-muted-foreground">Learn advanced React techniques and patterns</p>
                <div className="mt-2 flex items-center text-sm">
                  <span className="inline-flex items-center mr-3">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    743 students
                  </span>
                  <span className="inline-flex items-center">
                    <BookOpen className="h-3.5 w-3.5 mr-1" />
                    12 modules
                  </span>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-3 hover:bg-accent/50 transition-colors">
              <div className="flex flex-col space-y-1.5">
                <h3 className="font-semibold">Node.js Backend Development</h3>
                <p className="text-sm text-muted-foreground">Build scalable backends with Node.js and Express</p>
                <div className="mt-2 flex items-center text-sm">
                  <span className="inline-flex items-center mr-3">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    531 students
                  </span>
                  <span className="inline-flex items-center">
                    <BookOpen className="h-3.5 w-3.5 mr-1" />
                    15 modules
                  </span>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-3 hover:bg-accent/50 transition-colors">
              <div className="flex flex-col space-y-1.5">
                <h3 className="font-semibold">TypeScript Fundamentals</h3>
                <p className="text-sm text-muted-foreground">Master TypeScript for better JavaScript development</p>
                <div className="mt-2 flex items-center text-sm">
                  <span className="inline-flex items-center mr-3">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    892 students
                  </span>
                  <span className="inline-flex items-center">
                    <BookOpen className="h-3.5 w-3.5 mr-1" />
                    10 modules
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild className="w-full">
            <Link href="/courses">Browse All Courses</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}