import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Corrected import

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Fetch the course with its modules
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: true, // Include modules to access their type and content
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Calculate total duration
    let totalDuration = 0;

    course.modules.forEach((module) => {
      if (module.type === 'VIDEO' && module.content) {
        const durationParts = module.content.split(':').map(Number); // Assuming content is in HH:MM:SS format
        const seconds =
          (durationParts[0] || 0) * 3600 +
          (durationParts[1] || 0) * 60 +
          (durationParts[2] || 0);
        totalDuration += seconds;
      } else if (module.type === 'PDF' || module.type === 'TEXT') {
        // Assuming PDFs and texts have a fixed duration estimate (e.g., 5 minutes per item)
        totalDuration += 5 * 60; // 5 minutes per resource
      }
    });

    // Convert total duration to HH:MM:SS format
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    const seconds = totalDuration % 60;
    const formattedDuration = `${hours}h ${minutes}m ${seconds}s`;

    return NextResponse.json({ totalDuration: formattedDuration });
  } catch (error) {
    console.error('Error calculating course duration:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
