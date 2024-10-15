"use server";

import { prisma } from "../prismadb";

export const clearStaleTokens = async () => {
  try {
    await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    throw error;
  }
};
