"use server";

import { signIn } from "./authConfig";

export const handleEmailSignIn = async (email: string) => {
  try {
    await signIn("nodemailer", { email, callbackUrl: "/Dashboard/Home" });
  } catch (error) {
    throw error;
  }
};
