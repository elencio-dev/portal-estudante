"use client";

import axios from 'axios'
import { useEffect, useState } from "react";
import DocumentsData from '@/components/documents-data';
import CreatePostDialog from '@/components/CreatePostDialog';
import SearchComponent from '@/components/SearchComponent';
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { PlusIcon, GridIcon, ListIcon, Loader2Icon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Document {
  id: string;
  name: string;
  professor: string;
  semester: string;
  discipline: string;
  fileUrl?: string;
  fileName: string;
  file?: File;
}


export default function Dashboard() {
  const { status } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchDocuments();
    }
  }, [status]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/Docs');
      if (response.status === 200) {
        setDocuments(response.data);
      } else {
        console.error('Falha ao carregar os documentos');
      }
    } catch (error) {
      console.error('Falha ao carregar os documentos:', error);
    } finally {
      setIsLoading(false);
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
  const filteredDocuments = selectedCategory === 'All'
    ? displayDocuments
    : displayDocuments.filter(doc => doc.discipline === selectedCategory);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Acesso negado</div>;
  }

  return (
    <div className="flex h-screen bg-background">

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-6">
          {/* Header */}
          <div className="justify-between items-center mt-12">
            <div className="flex space-x-4 items-cente flex-row justify-between">
              <CreatePostDialog />
              <SearchComponent handleSearch={handleSearch} />
            </div>
          </div>
          {filteredDocuments.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {isSearching ? "Nenhum documento encontrado." : "Nenhum documento cadastrado ainda."}
            </p>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc: Document) => (
                <div key={doc.id}>
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
              ))}
            </div>

          )}
        </div>
      </div>
    </div>
  );
}