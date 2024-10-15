import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prismadb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const course = searchParams.get('course');

    if (!course) {
      return NextResponse.json({ error: 'Curso não especificado' }, { status: 400 });
    }

    const semesters = await prisma.semester.findMany({
      where: {
        discipline: {
          course: {
            name: course
          }
        }
      },
      select: {
        id: true,
        name: true,
      },
      distinct: ['name'],
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(semesters, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar semestres:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
