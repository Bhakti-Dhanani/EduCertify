"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useSession, signOut } from "next-auth/react";
import AllCourses from "@/components/AllCourses";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface Course {
  id: string;
  title: string;
  published: boolean;
}

export default function Header() {
  const { data: session, status } = useSession();
  const [publishedCourses, setPublishedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchPublishedCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data: { courses: Course[] } = await response.json();
        const filteredCourses = data.courses.filter((course) => course.published);
        setPublishedCourses(filteredCourses);
      } catch (error) {
        console.error("Error fetching published courses:", error);
      }
    };

    fetchPublishedCourses();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-4"
        >
          <Link href="/" className="flex items-center space-x-2 group">
            <GraduationCap className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              LearnHub
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {['Features', 'Pricing', 'Enterprise', 'About Us', 'Contact'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase().replace(/ /g, '-')}`} 
                className="relative transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                {item}
              </Link>
            ))}
            <Link 
              key="Courses" 
              href="/courses" 
              className="relative transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
            >
              Courses
            </Link>
            {publishedCourses.map((course) => (
              <Link 
                key={course.id} 
                href={`/courses/${course.id}`} 
                className="relative transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                {course.title}
              </Link>
            ))}
          </nav>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-4"
        >
          <Input placeholder="Search for anything" className="w-64" />
          {status === "loading" || !session ? (
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost" className="hover:bg-primary/10">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="ghost" className="hover:bg-primary/10">
                  Get Started
                </Button>
              </Link>
            </div>
          ) : session.user?.name ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {session.user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">Welcome, {session.user.name}!</span>
              <Button
                variant="ghost"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  if (typeof window !== "undefined") {
                    window.history.replaceState(null, "", "/");
                  }
                }}
                className="hover:bg-primary/10"
              >
                Logout
              </Button>
              {session && session.user?.role && (
                <Link href={`/${session.user.role.toLowerCase()}/dashboard`}>
                  <Button variant="ghost" className="hover:bg-primary/10">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          ) : null}
          <ThemeToggle />
        </motion.div>
      </div>
    </header>
  );
}