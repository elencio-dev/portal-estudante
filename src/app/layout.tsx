import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import NextAuthSession from "@/providers/NextAuthSession";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PEPRO",
  description: "Faça upload dos seus trabalhos, listas e testes anteriores para ajudar outros alunos que estão cursando a disciplina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className}`}>
        <NextAuthSession>
          <Header />
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow "> {/* Add top margin to account for fixed header */}
              {children}
            </main>
            <Toaster />
          </div>
        </NextAuthSession>
      </body>
    </html>
  );
}
