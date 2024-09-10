'use client'

import { useEffect, useState } from "react"
import axios from 'axios'
import { useSession } from "next-auth/react"
import { Loader2, ChevronRight, Building2, GraduationCap, CalendarDays, BookOpen, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import CreatePostDialog from '@/components/CreatePostDialog'
import SearchComponent from '@/components/SearchComponent'
import DocumentCard from "@/components/DocumentCard"
import Section from "@/components/SectionCard"
import { Course, Discipline, Document, Institute, Semester } from "@/types/interface.document"

export default function Dashboard() {
  const { status } = useSession()
  const [documents, setDocuments] = useState<Document[]>([])
  const [docs, setDocs] = useState<Document[]>([])
  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInstitute, setSelectedInstitute] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null)
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "authenticated") fetchData()
  }, [status])

  useEffect(() => {
    if (selectedInstitute) {
      fetchCourses(selectedInstitute)
      setSelectedCourse(null)
      setSelectedSemester(null)
      setSelectedDiscipline(null)
      setDocs([])
    } else {
      setDocs(documents)
    }
  }, [selectedInstitute, documents])

  useEffect(() => {
    if (selectedCourse) {
      fetchSemesters(selectedCourse.name)
      setSelectedSemester(null)
      setSelectedDiscipline(null)
    }
  }, [selectedCourse])

  useEffect(() => {
    if (selectedSemester) {
      fetchDisciplines(selectedSemester.id)
      setSelectedDiscipline(null)
    }
  }, [selectedSemester])

  useEffect(() => {
    if (selectedDiscipline && selectedSemester) {
      fetchDocumentsByDiscipline(selectedDiscipline.id)
    }
  }, [selectedDiscipline, selectedSemester])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [documentsResponse, institutesResponse] = await Promise.all([
        axios.get('/api/Docs'),
        axios.get('/api/institutes')
      ])
      
      if (documentsResponse.status === 200) {
        setDocuments(documentsResponse.data)
        setDocs(documentsResponse.data)
      }
      if (institutesResponse.status === 200) setInstitutes(institutesResponse.data)
    } catch (error) {
      console.error('Falha ao carregar os dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCourses = async (institute: string) => {
    try {
      const response = await axios.get(`/api/courses?institute=${institute}`)
      if (response.status === 200) setCourses(response.data)
    } catch (error) {
      console.error('Falha ao carregar os cursos:', error)
    }
  }

  const fetchSemesters = async (course: string) => {
    try {
      const response = await axios.get(`/api/semesters?course=${course}`)
      if (response.status === 200) setSemesters(response.data)
    } catch (error) {
      console.error('Falha ao carregar os semestres:', error)
    }
  }

  const fetchDisciplines = async (semesterId: string) => {
    try {
      const response = await axios.get(`/api/discipline?semester=${semesterId}`)
      if (response.status === 200) setDisciplines([response.data])
    } catch (error) {
      console.error('Falha ao carregar as disciplinas:', error)
    }
  }

  const fetchDocumentsByDiscipline = async (disciplineId: string) => {
    try {
      const response = await axios.get(`/api/SearchDocsByDiscipline?disciplineId=${disciplineId}&semesterId=${selectedSemester?.id}`)
      if (response.status === 200) setDocs(response.data)
    } catch (error) {
      console.error('Falha ao carregar os documentos da disciplina:', error)
    }
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    const filteredDocs = documents.filter(doc => 
      doc.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
      doc.professor.toLowerCase().includes(event.target.value.toLowerCase()) ||
      doc.discipline.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
      doc.semester.name.toLowerCase().includes(event.target.value.toLowerCase())
    )
    setDocs(filteredDocs)
  }

  const handleInstituteSelect = (institute: string) => {
    setSelectedInstitute(selectedInstitute === institute ? null : institute)
    setIsSidebarOpen(false)
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen mt-16">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return <div className="flex justify-center items-center h-screen mt-16 text-xl font-semibold">Acesso negado</div>
  }

  const Sidebar = () => (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold mb-2">Institutos</h2>
        {institutes.map(institute => (
          <Button
            key={institute.name}
            variant={selectedInstitute === institute.name ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleInstituteSelect(institute.name)}
          >
            <ChevronRight className="mr-2 h-4 w-4" />
            {institute.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )

  const Breadcrumb = () => (
    <nav className="flex flex-wrap items-center space-x-2 text-sm text-muted-foreground bg-background p-2 sticky top-16 z-10 overflow-x-auto whitespace-nowrap">
      {[
        { label: selectedInstitute, action: () => { setSelectedInstitute(null); setSelectedCourse(null); setSelectedSemester(null); setSelectedDiscipline(null); }, icon: Building2 },
        { label: selectedCourse?.name, action: () => { setSelectedCourse(null); setSelectedSemester(null); setSelectedDiscipline(null); }, icon: GraduationCap },
        { label: selectedSemester?.name, action: () => { setSelectedSemester(null); setSelectedDiscipline(null); }, icon: CalendarDays },
        { label: selectedDiscipline?.name, action: () => setSelectedDiscipline(null), icon: BookOpen }
      ].filter(item => item.label).map((item, index, array) => (
        <div key={item.label} className="flex items-center mb-2">
          <Button variant="link" className="p-0 h-auto font-normal flex items-center" onClick={item.action}>
            {item.icon && <item.icon className="mr-1 h-4 w-4" />}
            <span className="truncate max-w-[100px] sm:max-w-none">{item.label}</span>
          </Button>
          {index < array.length - 1 && <ChevronRight className="h-4 w-4 mx-1" />}
        </div>
      ))}
    </nav>
  )

  return (
    <div className="flex flex-col h-screen bg-background pt-16">
      <div className="flex items-center justify-between p-4 lg:hidden">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] sm:w-[300px]">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block w-64 border-r">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              <h1 className="text-2xl font-bold hidden lg:block">Dashboard</h1>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                <CreatePostDialog />
                <SearchComponent handleSearch={handleSearch} />
              </div>
            </div>
            
            {selectedInstitute && <Breadcrumb />}

            {selectedInstitute && !selectedCourse && (
              <Section title="Cursos" items={courses} onItemClick={setSelectedCourse} />
            )}
            {selectedCourse && !selectedSemester && (
              <Section title="Semestres" items={semesters} onItemClick={setSelectedSemester} />
            )}
            {selectedSemester && !selectedDiscipline && (
              <Section title="Disciplinas" items={disciplines} onItemClick={setSelectedDiscipline} />
            )}
            {(selectedDiscipline || !selectedInstitute) && (
              <div className="space-y-4">
                {docs.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    Nenhum documento encontrado.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {docs.map((doc: Document) => (
                      <DocumentCard key={doc.id} document={doc} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}