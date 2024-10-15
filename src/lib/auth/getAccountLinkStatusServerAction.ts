"use server";

import { prisma } from "../prismadb";
import { auth } from "./authConfig";

export const getAccountLinkStatus = async () => {
  // Check if the user is authenticated
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const uuid: string = session?.user?.id ?? '';


  // Check if the user has a Google account linked
  try {
    const account = await prisma.account.findFirst({
      where: {
        provider: "google",
        userId: uuid, 
      },
    });

    // If no account is found, return false
    if (!account) {
      return false;
    }
  } catch (error) {
    console.error("Failed to check if user has Google account linked:", error);
    throw new Error("Database error");
  }

  return true;
};
