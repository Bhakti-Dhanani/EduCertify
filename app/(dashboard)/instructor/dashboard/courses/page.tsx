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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface Module {
  id: string;
  name: string;
  file: string;
  contentType: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  published?: boolean;
  modules?: Module[]; // Added modules property
}

export const dynamic = "force-static";

export default function InstructorCoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

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
        setCourses(data.courses); // Revert to showing all courses
      } catch (error) {
        console.error("Error fetching instructor's courses:", error);
      }
    };

    if (session?.user?.id) {
      fetchInstructorCourses();
    }
  }, [session?.user?.id]);

  const handleDeleteCourse = async (courseId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
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
        alert("Course deleted successfully.");
        window.location.reload(); // Refresh the page to update the course list
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("An error occurred while deleting the course.");
      }
    }
  };

  const calculateModuleDuration = (
    moduleFile: File,
    moduleContentType: string
  ): string => {
    if (moduleContentType === "video") {
      // Placeholder logic for video duration calculation
      return "10:00"; // Example: 10 minutes
    } else if (moduleContentType === "pdf") {
      // Placeholder logic for PDF duration calculation
      return "5:00"; // Example: 5 minutes
    }
    return "0:00";
  };

  const handleAddModule = async (
    courseId: string,
    moduleName: string,
    moduleFile: File,
    moduleContentType: string
  ) => {
    if (!moduleName || !moduleFile || !moduleContentType) return;

    const formData = new FormData();
    formData.append("name", moduleName);
    formData.append("file", moduleFile);
    formData.append("contentType", moduleContentType);

    try {
      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const newModule = await response.json();
        newModule.duration = calculateModuleDuration(moduleFile, moduleContentType);
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === courseId
              ? { ...course, modules: [...(course.modules || []), newModule] }
              : course
          )
        );
      }
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  function AddModuleForm({
    courseId,
    onClose,
  }: {
    courseId: string;
    onClose: () => void;
  }) {
    const [moduleName, setModuleName] = useState("");
    const [moduleFile, setModuleFile] = useState<File | null>(null);
    const [moduleContentType, setModuleContentType] = useState("");

    const handleSaveModule = async () => {
      if (!moduleName || !moduleFile || !moduleContentType) return;

      try {
        await handleAddModule(courseId, moduleName, moduleFile, moduleContentType);
        onClose(); // Close the form only after successful save
      } catch (error) {
        console.error("Error saving module:", error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4">Add Module</h2>
          <input
            type="text"
            placeholder="Module Name"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-4"
          />
          <select
            value={moduleContentType}
            onChange={(e) => setModuleContentType(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-4"
          >
            <option value="">Select Content Type</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
          </select>
          <input
            type="file"
            onChange={(e) => setModuleFile(e.target.files?.[0] || null)}
            className="border rounded px-3 py-2 w-full mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveModule}
              disabled={!moduleName || !moduleFile || !moduleContentType}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <Link
              href={`/courses/${course.id}`}
              className="block hover:no-underline focus:no-underline"
              onClick={(e) => {
                if (showAddModuleForm && selectedCourseId === course.id) {
                  e.preventDefault(); // Prevent navigation when Add Module form is open
                }
              }}
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
                <div className="flex items-center justify-between mt-4">
                  {course.price && (
                    <span className="text-primary font-bold">
                      ₹{course.price}
                    </span>
                  )}
                  <span className="text-sm font-medium">
                    {course.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="mt-4">
                  <Link
                    href={`/courses/${course.id}`}
                    className="px-4 py-2 bg-black text-white text-sm rounded shadow hover:bg-gray-800 transition-all duration-200"
                  >
                    View Details
                  </Link>
                </div>
                <div className="mt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-2">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => window.location.href = `/dashboard/instructor/dashboard/courses/edit?courseId=${course.id}`}>Edit Course</DropdownMenuItem>
                       <DropdownMenuItem
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setShowAddModuleForm(true);
                        }}
                      >
                        Add Module
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-500"
                      >
                        Delete Course
                      </DropdownMenuItem>
                     
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
      {/* Removed the Create Course button since it's now in the dashboard */}
      {showAddModuleForm && selectedCourseId && (
        <AddModuleForm
          courseId={selectedCourseId}
          onClose={() => setShowAddModuleForm(false)}
        />
      )}
    </div>
  );
}