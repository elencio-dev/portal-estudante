"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { toast } from "@/hooks/use-toast"
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleFunction(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        console.error('Login failed:', result.error);
      } else if (result?.ok) {
        toast({
          title: "Documento cadastrado com sucesso!",
          description: "Feliz com o seu Upload",
        });
        router.push('/Home');
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('An unexpected error occurred: Invalid JSON response');
      } else {
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full md:w-1/2 max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFunction)} className="bg-white rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="email"
                    placeholder="seu@email.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">Senha</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    type="password"
                    placeholder="******************"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between mt-4">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
