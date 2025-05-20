"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export default function CreateModulePage() {
  const { id: courseId } = useParams();
  const [moduleData, setModuleData] = useState({
    title: "",
    type: "TEXT",
    content: "",
    order: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!moduleData.title || !moduleData.type) {
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
        body: JSON.stringify(moduleData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create module");
      }

      toast({
        title: "Success",
        description: "Module created successfully!",
      });
      
      router.push(`/dashboard/instructor/courses/${courseId}`);
    } catch (error) {
      console.error("Error creating module:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModuleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (value: string) => {
    setModuleData(prev => ({
      ...prev,
      type: value,
      // Reset content when type changes
      content: ""
    }));
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
            <Label htmlFor="title">Module Title*</Label>
            <Input
              id="title"
              name="title"
              placeholder="Introduction to Course Content"
              value={moduleData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Module Type*</Label>
            <Select
              value={moduleData.type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select module type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT">Text Lesson</SelectItem>
                <SelectItem value="VIDEO">Video Lesson</SelectItem>
                <SelectItem value="PDF">PDF Document</SelectItem>
                <SelectItem value="QUIZ">Quiz/Assessment</SelectItem>
                <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order*</Label>
            <Input
              id="order"
              name="order"
              type="number"
              min="0"
              placeholder="0"
              value={moduleData.order}
              onChange={handleInputChange}
            />
            <p className="text-sm text-muted-foreground">
              Determines the sequence of modules in the course (lower numbers appear first)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              {moduleData.type === "TEXT" && "Lesson Content"}
              {moduleData.type === "VIDEO" && "Video URL or Embed Code"}
              {moduleData.type === "PDF" && "PDF URL or Embed Code"}
              {moduleData.type === "QUIZ" && "Quiz Questions (JSON format)"}
              {moduleData.type === "ASSIGNMENT" && "Assignment Instructions"}
            </Label>
            
            {moduleData.type === "TEXT" ? (
              <Textarea
                id="content"
                name="content"
                placeholder="Enter your lesson content here (supports markdown)"
                value={moduleData.content}
                onChange={handleInputChange}
                rows={8}
              />
            ) : (
              <Input
                id="content"
                name="content"
                placeholder={
                  moduleData.type === "VIDEO" ? "https://example.com/video.mp4 or <iframe>..." :
                  moduleData.type === "PDF" ? "https://example.com/document.pdf" :
                  moduleData.type === "QUIZ" ? '{"questions": [...]}' :
                  "Describe the assignment requirements"
                }
                value={moduleData.content}
                onChange={handleInputChange}
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 border-t pt-6">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/instructor/courses/${courseId}`)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Module"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}