"use server";

import { prisma } from "../prismadb";
import { auth } from "./authConfig";


// Deletes the user's Google account record from the database
export const unlinkGoogleAccount = async () => {
  // Check if the user is authenticated
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const uuid: string = session?.user?.id ?? '';


  // Remove the Google account from the database using Prisma
  try {
    await prisma.account.deleteMany({
      where: {
        provider: "google",
        userId: uuid, // Match the userId and the Google provider
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to unlink Google account:", error);
    throw new Error("Database error");
  }
};
