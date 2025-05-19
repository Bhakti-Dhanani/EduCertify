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
} from "@/components/ui/card";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  published?: boolean;
}

export const dynamic = "force-static";

export default function InstructorCoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);

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
        setCourses(data.courses);
      } catch (error) {
        console.error("Error fetching instructor's courses:", error);
      }
    };

    if (session?.user?.id) {
      fetchInstructorCourses();
    }
  }, [session?.user?.id]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="border rounded-lg overflow-hidden shadow-md"
          >
            {course.thumbnail && (
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
            )}
            <CardContent>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
              <div className="flex items-center justify-between mt-4">
                {course.price && (
                  <span className="text-primary font-bold">₹{course.price}</span>
                )}
                <span className="text-sm font-medium">
                  {course.published ? "Published" : "Draft"}
                </span>
              </div>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/courses/${course.id}`, {
                      method: "DELETE",
                    });
                    if (!response.ok) {
                      throw new Error("Failed to delete course");
                    }
                    setCourses((prevCourses) =>
                      prevCourses.filter((c) => c.id !== course.id)
                    );
                  } catch (error) {
                    console.error("Error deleting course:", error);
                  }
                }}
                className="mt-2 text-red-500 hover:underline"
              >
                Delete Course
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Removed the Create Course button since it's now in the dashboard */}
    </div>
  );
}