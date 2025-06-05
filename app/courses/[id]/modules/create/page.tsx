"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const lessonTypes = [
  { value: "pdf", label: "PDF" },
  { value: "docs", label: "Docs File" },
  { value: "video", label: "Video Content" },
  { value: "text", label: "Text Content" },
  { value: "quiz", label: "Quiz" },
];

export default function CreateModulePage() {
  const { id: courseId } = useParams();
  const router = useRouter(); // Reintroduce useRouter for navigation

  const [moduleTitle, setModuleTitle] = useState<string>("");
  const [lessons, setLessons] = useState<Array<{ title: string; type: string; description?: string; link?: string }>>([]);
  const [showLessonForm, setShowLessonForm] = useState<boolean>(false);
  const [lessonDetails, setLessonDetails] = useState<{ title: string; type: string; description?: string; link?: string }>({
    title: "",
    type: "",
    description: "",
    link: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addLesson = () => {
    if (!moduleTitle) {
      toast({
        title: "Error",
        description: "Please add a module title before adding lessons.",
        variant: "destructive",
      });
      return;
    }
    setShowLessonForm(true);
  };

  const saveLesson = () => {
    setLessons((prev) => [...prev, { ...lessonDetails }]);
    setLessonDetails({ title: "", type: "", description: "", link: "" });
    setShowLessonForm(false);
  };

  const saveModule = async () => {
    if (!moduleTitle || lessons.length === 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          module: { title: moduleTitle },
          lessons,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create module");
      }

      toast({
        title: "Success",
        description: "Module and lessons created successfully!",
      });

      router.push(`/courses/${courseId}`);
    } catch (error) {
      console.error("Error creating module and lessons:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContentBox = () => {
    switch (lessonDetails.type) {
      case "video":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">Video URL</label>
            <Input
              type="url"
              placeholder="Enter video URL"
              value={lessonDetails.link || ""}
              onChange={(e) =>
                setLessonDetails((prev) => ({ ...prev, link: e.target.value }))
              }
            />
          </div>
        );
      case "pdf":
      case "docs":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">File URL</label>
            <Input
              type="url"
              placeholder="Enter file URL"
              value={lessonDetails.link || ""}
              onChange={(e) =>
                setLessonDetails((prev) => ({ ...prev, link: e.target.value }))
              }
            />
          </div>
        );
      case "text":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">Text Content</label>
            <Textarea
              placeholder="Enter text content"
              value={lessonDetails.description || ""}
              onChange={(e) =>
                setLessonDetails((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
        );
      case "quiz":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">Quiz Details</label>
            <Textarea
              placeholder="Enter quiz details"
              value={lessonDetails.description || ""}
              onChange={(e) =>
                setLessonDetails((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Module</CardTitle>
          <CardDescription>
            Add a new learning module to your course. Fill in the details below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">Module Title</label>
            <Input
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="Enter module title"
            />
          </div>

          <div className="space-y-2">
            <Button onClick={addLesson}>Add Lesson</Button>
          </div>

          {showLessonForm && (
            <div className="mb-6 border p-4 rounded">
              <h2 className="text-xl font-bold mb-4">Add Lesson</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-2">Lesson Title</label>
                  <Input
                    type="text"
                    placeholder="Enter lesson title"
                    value={lessonDetails.title}
                    onChange={(e) =>
                      setLessonDetails((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-2">Lesson Type</label>
                  <Select onValueChange={(value) => setLessonDetails((prev) => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lesson type" />
                    </SelectTrigger>
                    <SelectContent>
                      {lessonTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {renderContentBox()}
                <Button onClick={saveLesson}>Save Lesson</Button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Lessons</h2>
            {lessons.map((lesson, index) => (
              <div key={index} className="border p-4 rounded mb-4">
                <p className="font-medium">Title: {lesson.title}</p>
                <p>Type: {lesson.type}</p>
                {lesson.type === "description" && <p>Description: {lesson.description}</p>}
                {lesson.type === "link" && <p>Link: {lesson.link}</p>}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 border-t pt-6">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/instructor/dashboard/courses`)}
          >
            Cancel
          </Button>
          <Button 
            onClick={saveModule}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Module"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}