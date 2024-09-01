import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import NextAuthSession from "@/providers/NextAuthSession";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PEPRO",
  description: "Faça upload dos teus trabalhos, listas, testes passados para ajudar que estão a cursar á displina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSession>
          <Header />
          {children}
          <Toaster />
        </NextAuthSession>
      </body>
    </html>
  );
}
