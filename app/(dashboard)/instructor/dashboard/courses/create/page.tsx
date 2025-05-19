"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(false);

  const handleCreateCourse = async () => {
    const courseData = { title, description, thumbnail, price: parseFloat(price), published };

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create course");
        return;
      }

      alert("Course created successfully!");
    } catch (error) {
      alert("An unexpected error occurred");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Course</h1>
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
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Published</label>
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
      </div>
      <Button onClick={handleCreateCourse}>Create Course</Button>
    </div>
  );
}
