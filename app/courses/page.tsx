"use client";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Clock, BookOpen, Users, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  published?: boolean;
  rating?: number;
  duration?: string;
  students?: number;
  lessons?: number;
  category?: string;
}

export default function AllCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        // Add mock data for missing fields
        const enhancedCourses = data.courses.map((course: Course) => ({
          ...course,
          rating: course.rating || (Math.random() * 2 + 3).toFixed(1),
          duration: course.duration || `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(Math.random() * 60)}m`,
          students: course.students || Math.floor(Math.random() * 1000),
          lessons: course.lessons || Math.floor(Math.random() * 30) + 5,
          category: course.category || ["Web Dev", "Design", "Business", "Marketing"][Math.floor(Math.random() * 4)],
          thumbnail: course.thumbnail || `https://source.unsplash.com/random/300x200/?${course.title.split(" ")[0]}`
        }));
        setCourses(enhancedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = ["All", ...Array.from(new Set(courses.map(course => course.category)))];

  const filteredCourses = activeCategory === "All" 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Explore Our Courses
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover a variety of courses designed to help you achieve your goals and advance your career.
        </p>
      </motion.div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => {
          // Ensure 'category' is always a string by providing a fallback value
          const safeCategory = category || "Uncategorized";

          return (
            <Button
              key={safeCategory}
              variant={activeCategory === safeCategory ? "default" : "outline"}
              onClick={() => setActiveCategory(safeCategory)}
              className="rounded-full px-6"
            >
              {safeCategory}
            </Button>
          );
        })}
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border rounded-xl overflow-hidden">
              <Skeleton className="w-full h-48 rounded-b-none" />
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-background"
            >
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <Badge variant="secondary" className="absolute top-3 left-3">
                  {course.category}
                </Badge>
                {course.published ? (
                  <Badge variant="default" className="absolute top-3 right-3">
                    Published
                  </Badge>
                ) : (
                  <Badge variant="outline" className="absolute top-3 right-3">
                    Draft
                  </Badge>
                )}
              </div>
              
              <div className="p-5">
                <h2 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{course.students}+</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    {course.price > 0 ? `$${course.price}` : "Free"}
                  </span>
                  <Link href={`/courses/${course.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      View <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-muted-foreground mt-2">
            We couldn't find any courses matching your selection.
          </p>
        </div>
      )}
    </div>
  );
}