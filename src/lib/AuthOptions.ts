import { AuthOptions, Awaitable, RequestInternal, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prismadb";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email e o seu password são obrigatórios");
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (!user || !user.id || !user.hashedPassword) {
          throw new Error("Usuario não encontrado");
        }

        const currentHashedPassword = await bcrypt.hash(credentials.password, 12);

        bcrypt.compare(currentHashedPassword, user.hashedPassword)

        return user;

      }
    }),

  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
}