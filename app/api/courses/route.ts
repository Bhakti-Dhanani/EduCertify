import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Schema for course creation
const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  thumbnail: z.string().optional(),
  price: z.number().optional(),
  published: z.boolean().optional(),
});


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("query") || "";
    const instructorId = searchParams.get("instructorId");
    const published = searchParams.get("published") === "true";

    // Create base query
    let queryOptions: any = {
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
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
        _count: {
          select: {
            enrollments: true,
            modules: true, // Include module count for each course
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    };

    // Add filters if provided
    if (instructorId) {
      queryOptions.where.OR = [
        { creatorId: instructorId },
        { instructors: { some: { id: instructorId } } },
      ];
    }

    if (searchParams.has("published")) {
      queryOptions.where.published = published;
    }

    // Get total count and courses
    const [totalCount, courses] = await Promise.all([
      prisma.course.count({
        where: queryOptions.where,
      }),
      prisma.course.findMany(queryOptions),
    ]);

    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to create a course" },
        { status: 401 }
      );
    }

    // Type assertion for session.user
    const user = session.user as {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };

    // Check authorization (only ADMIN and INSTRUCTOR can create courses)
    if (
      user.role !== "ADMIN" &&
      user.role !== "INSTRUCTOR"
    ) {
      return NextResponse.json(
        { error: "You are not authorized to create courses" },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate request data
    const result = courseSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", issues: result.error.issues },
        { status: 400 }
      );
    }
    
    const { title, description, thumbnail, price, published } = result.data;
    
    // Create new course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        price: price ? price : null,
        published: published || false,
        creatorId: user.id,
        instructors: {
          connect: {
            id: user.id,
          },
        },
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
      },
    });
    
    return NextResponse.json(
      {
        message: "Course created successfully",
        course,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "An error occurred during course creation" },
      { status: 500 }
    );
  }
}