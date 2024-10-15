import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prismadb";

export async function GET() {
  try {
    const institutes = await prisma.institute.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(institutes, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar institutos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
