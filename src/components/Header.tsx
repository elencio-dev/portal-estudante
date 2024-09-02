"use client"; // Add this at the top

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";



export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b-2 border-gray-200">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center">
              <Image src="/Logo.png" alt="PEPRO Logo" width={40} height={40} className="mr-2 rounded" />
              <h1 className="text-xl font-bold text-gray-800">PEPRO</h1>
            </div>
          </Link>
        </div>
        {/* Navigation menu */}
        <nav className="flex items-center space-x-4">
          {session ? (
            <>
              <Button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                Sair
              </Button>
            </>
          ) : (
            <Link href="/">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out">
                Entrar
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
