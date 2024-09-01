import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { NextApiRequest, NextApiResponse } from "next";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await NextAuth(req, res, authOptions);
  } catch (error) {
    if (error instanceof Error) {
      res.status(504).json({ message: "An error occurred: " + error.message });
    } else {
      res.status(504).json({ message: "An unknown error occurred" });
    }
  }
};

export { handler as GET, handler as POST };