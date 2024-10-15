"use server";
import { prisma } from "../prismadb";
import { auth } from "./authConfig";

export const setName = async (name: string) => {
  // Check if the user is authenticated
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const uuid: string = session?.user?.id ?? '';



  // Update the user's name in the database using Prisma
  try {
    await prisma.user.update({
      where: {
        id: uuid, // Match the user by UUID
      },
      data: {
        name, // Update the name field
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to update user name:", error);
    throw new Error("Database error");
  }
};
