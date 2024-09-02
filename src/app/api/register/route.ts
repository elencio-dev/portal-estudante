import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("Campos vazios", { status: 400 });
    }

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userAlreadyExists) {
      return new NextResponse("Usuário existente", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        hashedPassword: hashedPassword,
      },
    });

    return NextResponse.json(newUser);

  } catch (error) {
    return new NextResponse("Error registering user", { status: 500 });
    console.log(error);
  }
}