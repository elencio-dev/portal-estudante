import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { z } from "zod";
import { uploadFileToFirebase } from "@/lib/uploadToFirebase";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  professor: z.string().min(1, "Professor é obrigatório"),
  semester: z.string().min(1, "Semestre é obrigatório"),
  discipline: z.string().min(1, "Disciplina é obrigatório"),
  file: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "Apenas arquivos PDF são permitidos",
    }),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const professor = formData.get('professor') as string;
    const semester = formData.get('semester') as string;
    const discipline = formData.get('discipline') as string;
    const file = formData.get('file') as File;

    const validatedData = formSchema.parse({
      name,
      professor,
      semester,
      discipline,
      file,
    });

    // Upload do arquivo para o Firebase Storage e obtenção da URL
    const fileUrl = await uploadFileToFirebase(validatedData.file);

    // Salvar os dados no banco de dados usando Prisma
    const document = await prisma.document.create({
      data: {
        name: validatedData.name,
        professor: validatedData.professor,
        semester: validatedData.semester,
        discipline: validatedData.discipline,
        fileName: validatedData.file.name,
        fileUrl: fileUrl,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Falha ao salvar o documento" }, { status: 500 });
    }

    return NextResponse.json({ message: "Documento cadastrado com sucesso" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Erro ao processar a requisição" }, { status: 500 });
  }
}
