"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AuthSuccessPage() {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a365d] to-[#2c5282] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white text-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#1a365d]">
            Bem-vindo ao Acervo Estudantil
          </CardTitle>
          <CardDescription>
            Sua jornada de aprendizado começa aqui
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <p className="text-lg font-semibold text-center">
              Sucesso! Por favor, verifique seu e-mail para o link de acesso.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              O link de acesso expirará em {countdown} segundos. Se não receber,
              verifique sua pasta de spam ou solicite um novo link.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full" variant="outline">
            <Link href="/api/auth/signin">
              <Mail className="mr-2 h-4 w-4" /> Solicitar novo link
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/">
              Ir para a página inicial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
