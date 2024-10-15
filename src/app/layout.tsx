import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acervo",
  description:
    "Faça upload dos seus trabalhos, listas e testes anteriores para ajudar outros alunos que estão cursando a disciplina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className}`}>
        <div className="flex flex-col min-h-screen">
          <SessionProvider>
            <main className="flex-grow ">{children}</main>
            <Toaster />
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
