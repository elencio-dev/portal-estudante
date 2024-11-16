import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const { pathname } = req.nextUrl;

  // Normalizar o pathname para evitar problemas com barras finais e maiúsculas/minúsculas
  const normalizedPath = pathname.toLowerCase().replace(/\/$/, '');

  // Rotas protegidas
  const protectedRoutes = ['/Dashboard/Home']; 

  // Rotas públicas que não devem ser acessadas por usuários autenticados
  const authRoutes = ['/',];

  // Redirecionar usuário autenticado tentando acessar rotas de autenticação
  if (isAuthenticated && authRoutes.includes(normalizedPath)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirecionar usuário não autenticado tentando acessar rotas protegidas
  if (!isAuthenticated && protectedRoutes.includes(normalizedPath)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
