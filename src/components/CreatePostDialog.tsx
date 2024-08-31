import axios from 'axios';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  professor: z.string().min(1, "Professor é obrigatório"),
  semester: z.string().min(1, "Semestre é obrigatório"),
  discipline: z.string().min(1, "Disciplina é obrigatório"),
  file: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf" || file.type.startsWith("image/"), {
      message: "Apenas arquivos PDF ou imagens são permitidos",
    }),
});

export default function CreatePostDialog() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { reset } = useForm()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      professor: "",
      semester: "",
      discipline: "",
      file: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("professor", values.professor);
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
        reset()
        // fetchDocuments(); // Recarregar documentos se necessário
      } else {
        console.error(response.data.error);
        alert("Erro ao cadastrar o documento.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao cadastrar o documento.");
    } finally {
      setLoading(false);
    }
  }



  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Cadastrar Documento</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="name" className="text-right">
                      Nome
                    </FormLabel>
                    <FormControl>
                      <Input {...field} id="name" className="col-span-3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="professor"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="professor" className="text-right">
                      Professor
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="professor"
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="semester" className="text-right">
                      Semestre
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="semester"
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discipline"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="discipline" className="text-right">
                      Disciplina
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="discipline"
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="file" className="text-right">
                      Arquivo
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        className="col-span-3"
                      />
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


    </>
  );
}
