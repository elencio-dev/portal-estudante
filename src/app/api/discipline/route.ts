import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const semesterId = searchParams.get('semester');

    if (!semesterId) {
      return NextResponse.json({ error: 'Semestre é obrigatório' }, { status: 400 });
    }

    const semester = await prisma.semester.findUnique({
      where: {
        id: semesterId,
      },
      select: {
        disciplineId: true,
      },
    });

    if (!semester) {
      return NextResponse.json({ message: 'Semestre não encontrado' }, { status: 404 });
    }

    const discipline = await prisma.discipline.findUnique({
      where: {
        id: semester.disciplineId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!discipline) {
      return NextResponse.json({ message: 'Disciplina não encontrada' }, { status: 404 });
    }

    return NextResponse.json(discipline, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar disciplina:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
