import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Schema for module creation
const moduleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["VIDEO", "TEXT", "PDF", "QUIZ", "ASSIGNMENT"]),
  content: z.any(),
  order: z.number().int().min(0),
});

// Extend the default session user type
interface UserSession {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;

    // Get all modules for the course, ordered by their position
    const modules = await prisma.module.findMany({
      where: {
        courseId,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({ modules });
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const courseId = params.id;

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to create a module" },
        { status: 401 }
      );
    }

    // Type assertion for the session user
    const user = session.user as UserSession;

    // Get the course to check authorization
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
    const isCreator = course.creatorId === user.id;
    const isInstructor = course.instructors.some(
      (instructor) => instructor.id === user.id
    );
    const isAdmin = user.role === "ADMIN";

    if (!isCreator && !isInstructor && !isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to add modules to this course" },
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log("Parsed request body:", body); // Debugging log

    const parsedBody = moduleSchema.safeParse(body);
    if (!parsedBody.success) {
      console.error("Validation failed:", parsedBody.error);
      return NextResponse.json(
        {
          error: "Invalid data",
          issues: parsedBody.error.issues,
        },
        { status: 400 }
      );
    }

    const { title, type, content, order } = parsedBody.data; // Ensure order is validated as a number
    console.log("Validated order field:", body.order); // Ensure order is received as a number

    try {
      // Create new module
      const module = await prisma.module.create({
        data: {
          title,
          type,
          content,
          order,
          courseId,
        },
      });

      return NextResponse.json(
        {
          message: "Module created successfully",
          module,
        },
        { status: 201 }
      );
    } catch (prismaError) {
      console.error("Prisma error during module creation:", prismaError);
      throw prismaError;
    }
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json(
      { error: "An error occurred during module creation" },
      { status: 500 }
    );
  }
}