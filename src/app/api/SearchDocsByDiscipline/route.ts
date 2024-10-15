import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prismadb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const disciplineId = searchParams.get('disciplineId');
  const semesterId = searchParams.get('semesterId');

  if (!disciplineId && !semesterId) {
    return NextResponse.json({ error: 'Discipline ID or Semester ID is required' }, { status: 400 });
  }

  try {
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { disciplineId: disciplineId || undefined },
          { semesterId: semesterId || undefined },
        ],
      },
      select: {
        id: true,
        name: true,
        professor: true,
        semester: {
          select: {
            name: true,
          },
        },
        discipline: {
          select: {
            name: true,
          },
        },
        fileUrl: true,
        fileName: true,
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error searching documents:', error);
    return NextResponse.json({ error: 'An error occurred while searching documents' }, { status: 500 });
  }
}
