"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as api from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/utils";

// validação Zod
const personSchema = z.object({
    name: z.string().min(3, "O nome é obrigatório"),
    cpf: z
        .string()
        .length(11, "CPF deve ter 11 dígitos")
        .regex(/^\d+$/, "Só dígitos"),
    address: z.string().min(3, "O endereço é obrigatório")
});
type PersonFormData = z.infer<typeof personSchema>;

export interface PersonFormProps {
    initialData?: api.Person;
    onSuccess?: () => void;
}

export function PersonForm({ initialData, onSuccess }: PersonFormProps) {
    const form = useForm<PersonFormData>({
        resolver: zodResolver(personSchema),
        defaultValues: initialData ?? { name: "", cpf: "", address: "" }
    });

    // se mudar initialData, atualiza o form
    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    const onSubmit = async (values: PersonFormData) => {
        try {
            if (initialData) {
                await api.updatePerson(initialData.id, values);
                toastSuccess("Pessoa atualizada com sucesso!");
            } else {
                await api.createPerson(values);
                toastSuccess("Pessoa criada com sucesso!");
            }
            form.reset();
            onSuccess?.();
        } catch (err: any) {
            toastError(err.message);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="João da Silva" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                                <Input placeholder="12345678901" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                                <Input placeholder="Rua X, 123" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    {initialData ? "Salvar" : "Cadastrar"}
                </Button>
            </form>
        </Form>
    );
}
