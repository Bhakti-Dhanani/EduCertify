import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.S3_REGION || "",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to upload files" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Get upload type (e.g. profile, assignment, course-material, etc.)
    const uploadType = formData.get("type") as string || "general";
    
    // Check file size based on upload type
    const fileSizeInMB = file.size / (1024 * 1024);
    const maxSizes: Record<string, number> = {
      "profile": 2, // 2MB
      "assignment": 10, // 10MB
      "course-material": 50, // 50MB
      "course-thumbnail": 5, // 5MB
      "general": 10, // 10MB default
    };
    
    const maxSize = maxSizes[uploadType] || maxSizes.general;
    
    if (fileSizeInMB > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds the maximum limit of ${maxSize}MB` },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uploadType}/${uuidv4()}.${fileExtension}`;
    
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET || "",
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });
    
    await s3Client.send(command);
    
    // Generate the URL to the uploaded file
    const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`;
    
    return NextResponse.json({
      message: "File uploaded successfully",
      fileUrl,
      fileName,
    });
    
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}