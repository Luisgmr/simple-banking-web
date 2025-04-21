"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {formatCpf, isValidCpf, toastError, toastSuccess, toTitleCase, unformatCpf} from "@/lib/utils";
import * as api from "@/lib/api";
import {AnimatedButton} from "@/components/AnimatedButton";

const personSchema = z.object({
    name: z
        .string()
        .min(3, "O nome é obrigatório")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Números não são permitidos no nome")
        .transform(s => toTitleCase(s)),
    cpf: z
        .string()
        .length(11, "CPF deve ter 11 dígitos")
        .regex(/^\d+$/, "Só dígitos")
        .refine(c => isValidCpf(c), "CPF inválido"),
    address: z.string().min(3, "O endereço é obrigatório"),
});
type PersonFormData = z.infer<typeof personSchema>;

export interface PersonFormProps {
    initialData?: api.Person;
    onSuccess?: () => void;
}

export function PersonForm({ initialData, onSuccess }: PersonFormProps) {
    const isEdit = Boolean(initialData);

    const form = useForm<PersonFormData>({
        resolver: zodResolver(personSchema),
        defaultValues: initialData
            ? {
                ...initialData,
                cpf: initialData.cpf,
            }
            : { name: "", cpf: "", address: "" },
    });

    const onSubmit = async (values: PersonFormData) => {
        try {
            if (isEdit) {
                await api.updatePerson(initialData!.id, values);
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

    useEffect(() => {
        if (initialData) {
            form.reset({
                ...initialData,
                cpf: initialData.cpf,
            });
        }
    }, [initialData, form]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="João da Silva"
                                    disabled={isEdit}
                                    maxLength={64}
                                    {...field}
                                    onChange={e => {
                                        const noNumbers = e.target.value.replace(/[0-9]/g, '');
                                        const formatted = toTitleCase(noNumbers);
                                        field.onChange(formatted);
                                    }}
                                    onKeyDown={(e) => {
                                        if (/\d/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
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
                                <Input
                                    placeholder="123.456.789‑01"
                                    disabled={isEdit}
                                    inputMode="numeric"
                                    value={formatCpf(field.value ?? "")}
                                    onChange={(e) => {
                                        const only = unformatCpf(e.target.value)
                                        field.onChange(only)
                                    }}
                                />
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

                <AnimatedButton type="submit" className="w-full">
                    {isEdit ? "Salvar" : "Cadastrar"}
                </AnimatedButton>
            </form>
        </Form>
    );
}
