import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { professor: { contains: query, mode: 'insensitive' } },
          { semester: { contains: query, mode: 'insensitive' } },
          { discipline: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        professor: true,
        semester: true,
        discipline: true,
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
