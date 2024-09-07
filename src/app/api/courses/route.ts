import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const institute = searchParams.get('institute');

    if (!institute) {
      return NextResponse.json({ error: 'Instituto não especificado' }, { status: 400 });
    }

    const courses = await prisma.course.findMany({
      where: {
        institute: {
          name: institute
        }
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
