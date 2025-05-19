"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, FileText, Users, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/lib/constants"; // Import ROUTES

interface Course {
  id: string;
  title: string;
  students: number;
  progress: number;
  publishedAt: string;
  published?: boolean;
  description?: string;
  thumbnail?: string;
  price?: number;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  deadline: string;
  status: string;
  dueDate: string;
  pending: boolean;
  submissions: number;
}

export default function InstructorDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<Assignment[]>([]);
  const { data: session } = useSession();

  // State for the create course form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        const response = await fetch(
          `/api/courses?instructorId=${session?.user?.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        const publishedCourses = data.courses.filter((course: Course) => course.published === true); // Filter only published courses
        setCourses(publishedCourses);
      } catch (error) {
        console.error("Error fetching instructor's courses:", error);
      }
    };

    if (session?.user?.id) {
      fetchInstructorCourses();
    }
  }, [session?.user?.id]);

  // Update the create course function to handle the published state
  const handleCreateCourse = async () => {
    setLoading(true);
    try {
      const newCourse = {
        title,
        description,
        thumbnail,
        price: parseFloat(price),
        published,
      };

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      const createdCourse = await response.json();
      setCourses((prevCourses) => [...prevCourses, createdCourse]);
      setTitle("");
      setDescription("");
      setThumbnail("");
      setPrice("");
      setPublished(false);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your courses and teaching activity.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/10 p-2 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">213</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-500/10 p-2 rounded-full">
                <FileText className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold">40</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/10 p-2 rounded-full">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teaching Hours</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Courses */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Overview of your published courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {courses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between">
                    <Link
                      href={ROUTES.INSTRUCTOR.COURSES} // Updated to match sidebar route
                      className="font-medium hover:underline"
                    >
                      {course.title}
                    </Link>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Progress value={course.progress} className="h-2" />
                    <span className="text-xs text-muted-foreground ml-2">
                      {course.progress}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Published {course.publishedAt}
                  </p>
                </div>
              ))}

              <div className="pt-2">
                <Button
                  variant="link"
                  className="text-sm text-primary hover:underline p-0"
                  onClick={() => setIsFormOpen(!isFormOpen)}
                >
                  + Create New Course
                  {isFormOpen ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </Button>
              </div>

              {isFormOpen && (
                <div className="space-y-4 p-4 border-t">
                  <h3 className="text-lg font-semibold">Create a New Course</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Course Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter course title"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Course Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter course description"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                    <Input
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      placeholder="Enter thumbnail URL"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter course price"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="form-checkbox"
                    />
                    <label htmlFor="published" className="text-sm">Publish Course</label>
                  </div>
                  <Button onClick={handleCreateCourse} disabled={loading}>
                    {loading ? "Creating..." : "Create Course"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assignments requiring review */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pending Assignments</CardTitle>
            <CardDescription>Assignments requiring your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pendingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="pb-4 last:pb-0 last:border-0 border-b"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        href={`/instructor/assignments/${assignment.id}`}
                        className="font-medium hover:underline"
                      >
                        {assignment.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{assignment.course}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      Due {assignment.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm">
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        {assignment.pending}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">{assignment.submissions}</span>{" "}
                      pending review
                    </p>
                    <Link
                      href={`/instructor/assignments/${assignment.id}`}
                      className="text-xs text-primary hover:underline"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href="/instructor/assignments"
                  className="text-sm text-primary hover:underline"
                >
                  View All Assignments
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest activities from your students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between pb-4 border-b">
              <div>
                <p className="font-medium">John Doe completed "React for Beginners"</p>
                <p className="text-sm text-muted-foreground">Final grade: A (95%)</p>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>

            <div className="flex items-start justify-between pb-4 border-b">
              <div>
                <p className="font-medium">New assignment submission</p>
                <p className="text-sm text-muted-foreground">
                  API Integration Exercise - Alice Smith
                </p>
              </div>
              <span className="text-sm text-muted-foreground">Today, 10:30 AM</span>
            </div>

            <div className="flex items-start justify-between pb-4 border-b">
              <div>
                <p className="font-medium">Forum question</p>
                <p className="text-sm text-muted-foreground">
                  "How do I structure my React components?" - Bob Johnson
                </p>
              </div>
              <span className="text-sm text-muted-foreground">Yesterday, 5:45 PM</span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">New enrollment</p>
                <p className="text-sm text-muted-foreground">
                  Mary Williams enrolled in "Advanced JavaScript Concepts"
                </p>
              </div>
              <span className="text-sm text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}