import Login from "@/components/Login";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row items-center justify-between p-8 md:p-24">
      <div className="w-full md:w-1/2 max-w-2xl mx-auto mb-12 md:mb-0">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Bem-vindo ao Portal do Estudante Proativo</h1>
        <p className="text-xl mb-8 text-gray-600">
          Compartilhe e acesse provas, listas e testes passados dos estudantes da UNILAB.
          Juntos, podemos nos preparar melhor e alcançar o sucesso acadêmico!
        </p>
        <div className="bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recursos Disponíveis</h2>
          <ul className="list-disc list-inside text-left mb-6 text-gray-600">
            <li>Provas anteriores de diversas disciplinas</li>
            <li>Listas de exercícios resolvidos</li>
            <li>Testes práticos com gabaritos</li>
          </ul>
          <span className="text-lg mb-4 text-gray-700">O material disponibilizado é para ajudar no entendimento da matéria, e não apenas para copiar</span>
        </div>
      </div>
      <Login />
    </main>
  );
}
