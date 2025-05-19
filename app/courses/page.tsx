"use client";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  published?: boolean;
}

export default function AllCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-6">Explore Our Courses</h1>
      <p className="text-center text-muted-foreground mb-12">
        Discover a variety of courses designed to help you achieve your goals.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={course.thumbnail || "https://via.placeholder.com/300x200"}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{course.title}</h2>
              <p className="text-sm text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold">${course.price || "Free"}</span>
                <Badge variant="default">{course.published ? "Published" : "Draft"}</Badge>
              </div>
              <Link
                href={`/courses/${course.id}`}
                className="mt-4 inline-block text-sm text-white bg-primary px-4 py-2 rounded hover:bg-primary/90 transition-colors"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
