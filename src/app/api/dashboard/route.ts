import { NextResponse } from "next/server";

import { z } from "zod";
import { uploadFileToFirebase } from "@/lib/uploadToFirebase";
import { prisma } from "@/lib/prismadb";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  professor: z.string().min(1, "Professor é obrigatório"),
  institute: z.string().min(1, "Instituto é obrigatório"),
  course: z.string().min(1, "Curso é obrigatório"),
  semester: z.string().min(1, "Semestre é obrigatório"),
  discipline: z.string().min(1, "Disciplina é obrigatória"),
  file: z.instanceof(File).refine((file) => file.type === "application/pdf" || file.type.startsWith("image/"), {
    message: "Apenas arquivos PDF ou imagens são permitidos",
  }),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const professor = formData.get('professor') as string;
    const instituteName = formData.get('institute') as string;
    const courseName = formData.get('course') as string;
    const semester = formData.get('semester') as string;
    const disciplineName = formData.get('discipline') as string;
    const file = formData.get('file') as File;

    const validatedData = formSchema.parse({
      name,
      professor,
      institute: instituteName,
      course: courseName,
      semester,
      discipline: disciplineName,
      file,
    });

    // Upload do arquivo para o Firebase Storage e obtenção da URL
    const fileUrl = await uploadFileToFirebase(validatedData.file);

    // Verificar se o instituto já existe ou criar um novo
    const institute = await prisma.institute.upsert({
      where: { name: validatedData.institute },
      update: {},
      create: { name: validatedData.institute },
    });

    // Verificar se o curso já existe ou criar um novo, associando ao instituto
    const course = await prisma.course.upsert({
      where: {
        name_instituteId: {
          name: validatedData.course,
          instituteId: institute.id,
        },
      },
      update: {},
      create: {
        name: validatedData.course,
        institute: { connect: { id: institute.id } },
      },
    });

    // Verificar se a disciplina já existe ou criar uma nova, associando ao curso
    const discipline = await prisma.discipline.upsert({
      where: {
        name_courseId: {
          name: validatedData.discipline,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        name: validatedData.discipline,
        course: { connect: { id: course.id } },
      },
    });

    // Verificar se o semestre já existe ou criar um novo, associando à disciplina
    const semesterRecord = await prisma.semester.upsert({
      where: {
        name_disciplineId: {
          name: validatedData.semester,
          disciplineId: discipline.id,
        },
      },
      update: {},
      create: {
        name: validatedData.semester,
        discipline: { connect: { id: discipline.id } },
      },
    });

    // Criar o documento
    const document = await prisma.document.create({
      data: {
        name: validatedData.name,
        professor: validatedData.professor,
        fileName: validatedData.file.name,
        fileUrl: fileUrl,
        institute: { connect: { id: institute.id } },
        course: { connect: { id: course.id } },
        discipline: { connect: { id: discipline.id } },
        semester: { connect: { id: semesterRecord.id } },
      },
    });


    return NextResponse.json({ message: "Documento cadastrado com sucesso", document }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Erro de validação:", error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erro ao processar a requisição:", error);
    return NextResponse.json({ error: "Erro ao processar a requisição" }, { status: 500 });
  }
}
