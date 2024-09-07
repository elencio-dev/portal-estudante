import axios from 'axios';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Institute {
  id: string;
  name: string;
  courses: string[];
}

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  professor: z.string().min(1, "Professor é obrigatório"),
  institute: z.string().min(1, "Instituto é obrigatório"),
  course: z.string().min(1, "Curso é obrigatório"),
  semester: z.string().min(1, "Semestre é obrigatório"),
  discipline: z.string().min(1, "Disciplina é obrigatória"),
  file: z.instanceof(File).refine((file) => file.type === "application/pdf" || file.type.startsWith("image/"), {
    message: "Apenas arquivos PDF ou imagens são permitidos",
  }),
});

export default function CreatePostDialog() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [institutes] = useState<Institute[]>([
    { id: "1", name: "ICEN", courses: ["Ciências Biológicas", "Matemática", "Física"] },
    { id: "2", name: "ICSA", courses: ["Administração Pública", "Serviço Social"] },
    { id: "3", name: "ICS", courses: ["Enfermagem", "Farmácia", "Medicina"] },
    { id: "4", name: "IDR", courses: ["Agronomia", "Engenharia de Alimentos"] },
    { id: "5", name: "IEDS", courses: ["Engenharia de Energias", "Engenharia da Computação"] },
    { id: "6", name: "IH", courses: ["Antropologia", "Sociologia", "Pedagogia", "História", "Humanidades"] },
    { id: "7", name: "ILL", courses: ["Língua Portuguesa", "Língua Inglesa"] },
  ]);

  const [availableCourses, setAvailableCourses] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      professor: "",
      institute: "",
      course: "",
      semester: "",
      discipline: "",
      file: undefined,
    },
  });

  useEffect(() => {
    const selectedInstitute = form.watch("institute");
    const institute = institutes.find(i => i.name === selectedInstitute);
    if (institute) {
      setAvailableCourses(institute.courses);
    } else {
      setAvailableCourses([]);
    }
  }, [form.watch("institute"), institutes]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("professor", values.professor);
      formData.append("institute", values.institute);
      formData.append("course", values.course);
      formData.append("semester", values.semester);
      formData.append("discipline", values.discipline);
      if (values.file) {
        formData.append("file", values.file);
      }

      const response = await axios.post('/api/dashboard', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast({
          title: "Documento cadastrado com sucesso!",
          description: "Feliz com o seu Upload",
        });
        form.reset();
        setOpen(false);
      } else {
        toast({
          title: "Erro ao cadastrar o documento",
          description: "Por favor, tente novamente",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao cadastrar o documento:", error);
      toast({
        title: "Erro ao cadastrar o documento",
        description: "Por favor, tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" variant="outline">
          <PlusIcon className="h-4 w-4" />
          <span>Cadastrar Documento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Documento</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do documento a ser cadastrado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="professor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professor</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="institute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instituto</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("course", "");
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um instituto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {institutes.map((institute) => (
                          <SelectItem key={institute.id} value={institute.name}>
                            {institute.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um curso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCourses.map((course, index) => (
                          <SelectItem key={index} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semestre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um semestre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2022.1">2022.1</SelectItem>
                        <SelectItem value="2022.2">2022.2</SelectItem>
                        <SelectItem value="2023.1">2023.1</SelectItem>
                        <SelectItem value="2023.2">2023.2</SelectItem>
                        <SelectItem value="2024.1">2024.1</SelectItem>
                        <SelectItem value="2024.2">2024.2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discipline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disciplina</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arquivo</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar documento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
