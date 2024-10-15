"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Simulate an API call or authentication retry
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // If successful, redirect to sign-in page
      window.location.href = "/api/auth/signin";
    } catch (error) {
      console.error("Retry failed:", error);
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-red-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">
            Erro de Autenticação
          </CardTitle>
          <CardDescription>
            Ocorreu um problema durante o processo de autenticação
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Tentando novamente...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente
              </>
            )}
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/api/auth/signin">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página de
              login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
