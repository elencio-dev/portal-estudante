import Login from "@/components/Login";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, CheckSquare } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row items-center justify-between p-8 md:p-24 mt-16 md:mt-0">
      <div className="w-full md:w-1/2 max-w-2xl mx-auto mb-12 md:mb-0">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Bem-vindo ao Acervo Estudantil </h1>
        <p className="text-xl mb-8 text-gray-600">
          Compartilhe e acesse provas, listas e testes passados dos estudantes da UNILAB.
          Juntos, podemos nos preparar melhor e alcançar o sucesso acadêmico!
        </p>
        <div className="bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recursos Disponíveis</h2>
          <ul className="space-y-4">
                  <li className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-500" />
                    <span>Provas anteriores de diversas disciplinas</span>
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                    <span>Listas de exercícios resolvidos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="mr-2 h-5 w-5 text-blue-500" />
                    <span>Testes práticos com gabaritos</span>
                  </li>
                </ul>
        </div>
      </div>
      <Login />
    </main>
  );
}
