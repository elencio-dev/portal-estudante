"use client";

import axios from 'axios'
import { useEffect, useState } from "react";
import DocumentsData from '@/components/documents-data';
import CreatePostDialog from '@/components/CreatePostDialog';
import SearchComponent from '@/components/SearchComponent';
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator"

export default function Dashboard() {
  const { status } = useSession();
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchDocuments();
    }
  }, [status]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/Docs');
      if (response.status === 200) {
        setDocuments(response.data);
      } else {
        console.error('Falha ao carregar os documentos');
      }
    } catch (error) {
      console.error('Falha ao carregar os documentos:', error);
    }
  };

  async function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    if (query) {
      setIsSearching(true);
      try {
        const response = await axios.get(`/api/search-documents?query=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
      }
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }

  const displayDocuments = isSearching ? searchResults : documents;

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <div>Acesso negado</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-12">
          <CreatePostDialog />
          <SearchComponent handleSearch={handleSearch} />
        </div>
      </div>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayDocuments.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            {isSearching ? "Nenhum documento encontrado." : "Nenhum documento cadastrado ainda."}
          </p>
        ) : (
          displayDocuments.map((doc: any) => (
            <div key={doc.id} className="bg-white p-4 rounded-lg mt-4">
              <DocumentsData
                name={doc.name}
                professor={doc.professor}
                semester={doc.semester}
                discipline={doc.discipline}
                fileUrl={doc.fileUrl}
                fileName={doc.fileName}
                file={doc.file}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
