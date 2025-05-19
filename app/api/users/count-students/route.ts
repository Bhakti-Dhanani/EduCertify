import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Count the total number of users with the role 'STUDENT'
    const studentCount = await prisma.user.count({
      where: { role: 'STUDENT' },
    });

    return NextResponse.json({ count: studentCount });
  } catch (error) {
    console.error('Error counting students:', error);
    return NextResponse.json({ error: 'Failed to count students' }, { status: 500 });
  }
}
