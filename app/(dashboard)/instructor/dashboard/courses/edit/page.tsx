"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EditCoursePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;

      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }
        const { course } = await response.json();
        setTitle(course.title);
        setDescription(course.description);
        setThumbnail(course.thumbnail);
        setPrice(course.price);
        setPublished(course.published);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Fixed the type issue for the error object
  const handleUpdateCourse = async () => {
    setLoading(true);
    try {
      const updatedCourse = {
        title,
        description,
        thumbnail,
        price: parseFloat(price),
        published,
      };

      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCourse),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update course");
      }

      alert("Course updated successfully.");
      router.push("/dashboard/instructor/dashboard/courses");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Error updating course:", errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  console.log("EditCoursePage loaded");
  console.log("courseId:", courseId);

  if (!courseId) {
    return <p>Course ID is missing. Please try again.</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Course Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter course title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Course Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter course description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
          <Input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="Enter thumbnail URL"
          />
        </div>
        <div>
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
        <Button onClick={handleUpdateCourse} disabled={loading}>
          {loading ? "Updating..." : "Update Course"}
        </Button>
      </div>
    </div>
  );
}
