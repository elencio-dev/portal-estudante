import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
