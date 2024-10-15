"use server";

import { auth } from "./authConfig";

export const getUserName = async () => {
  const session = await auth();
  if (session && session.user) {
    return session.user.name;
  }
};
