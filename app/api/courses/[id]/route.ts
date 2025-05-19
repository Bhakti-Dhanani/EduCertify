import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Schema for course update
const courseUpdateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  thumbnail: z.string().optional(),
  price: z.number().optional().nullable(),
  published: z.boolean().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;

    // Get the course with related data
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        instructors: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        modules: {
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const courseId = params.id;

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to update a course" },
        { status: 401 }
      );
    }

    // Get the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructors: {
          select: { id: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check authorization
    const isCreator = course.creatorId === session.user.id;
    const isInstructor = course.instructors.some(
      (instructor) => instructor.id === session.user.id
    );
    const isAdmin = session.user.role === "ADMIN";

    if (!isCreator && !isInstructor && !isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to update this course" },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate request data
    const result = courseUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", issues: result.error.issues },
        { status: 400 }
      );
    }
    
    // Update course
    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: result.data,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        instructors: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
    
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "An error occurred during course update" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const courseId = params.id;

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to delete a course" },
        { status: 401 }
      );
    }

    // Get the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check authorization (only creator or admin)
    const isCreator = course.creatorId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isCreator && !isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to delete this course" },
        { status: 403 }
      );
    }

    // Delete course (this will cascade delete related entities)
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });
    
    return NextResponse.json({
      message: "Course deleted successfully",
    });
    
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "An error occurred during course deletion" },
      { status: 500 }
    );
  }
}