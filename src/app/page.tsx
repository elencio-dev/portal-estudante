"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { handleEmailSignIn } from "@/lib/auth/emailSignInServerAction";
import { checkIsAuthenticated } from "@/lib/auth/checkIsAuthenticated";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkIsAuthenticated();
      if (isAuthenticated) {
        router.push("/Dashboard/Home");
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        await handleEmailSignIn(email);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Bem-vindo ao Acervo Estudantil
          </h1>
          <p className="text-base text-gray-600">
            Compartilhe e acesse provas, listas e testes passados dos estudantes
            da UNILAB. Juntos, podemos nos preparar melhor e alcançar o sucesso
            acadêmico!
          </p>
        </div>

        <Card className="">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Entrar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  maxLength={320}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                disabled={isPending}
              >
                {isPending ? <>Entrando...</> : "Entrar com Email"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
