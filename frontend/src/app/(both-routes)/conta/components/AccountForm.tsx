// src/app/(both-routes)/conta/components/AccountForm.tsx
"use client";

import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {toastError, toastSuccess, formatCpf} from "@/lib/utils";
import {SearchableSelect} from "@/components/SearchableSelect";
import {Account, createAccount, getPersonsSelect, Person, updateAccount} from "@/lib/api";
import {AnimatedButton} from "@/components/AnimatedButton";

const accountSchema = z.object({
    ownerId: z
        .number({required_error: "Selecione o titular"})
        .min(1, "Selecione o titular"),
    accountNumber: z
        .string()
        .min(4, "Número obrigatório")
        .regex(/^\d+$/, "Só dígitos"),
});
type AccountFormData = z.infer<typeof accountSchema>;

export interface AccountFormProps {
    initialData?: Account,
    onSuccess?: () => void,
    resetForm?: () => void
}

export function AccountForm({initialData, onSuccess, resetForm}: AccountFormProps) {
    const isEdit = Boolean(initialData);

    const form = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
        defaultValues: initialData
            ? {
                ownerId: initialData.owner.id,
                accountNumber: initialData.accountNumber,
            } : {
                ownerId: undefined,
                accountNumber: ""
            },

    });

    async function onSubmit(values: AccountFormData) {
        try {
            if (isEdit) {
                await updateAccount(initialData!.id, values);
                toastSuccess("Conta atualizada com sucesso!");
            } else {
                await createAccount(values);
                toastSuccess("Conta criada com sucesso!");
            }
            onSuccess?.();
            resetForm?.();
        } catch (err: any) {
            toastError(err.message);
        }
    }

    useEffect(() => {
        if (initialData) {
            form.reset({
                ownerId: initialData.owner.id,
                accountNumber: initialData.accountNumber,
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
                    name="ownerId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Titular</FormLabel>
                            <FormControl>
                                <SearchableSelect<Person>
                                    value={field.value?.toString()}
                                    onChange={(v) => field.onChange(Number(v))}
                                    selectPlaceholder="Selecione o titular"
                                    searchPlaceholder="Busque por nome ou CPF"
                                    fetchOptions={getPersonsSelect}
                                    getOptionValue={(p) => p.id.toString()}
                                    renderOption={(p) => (
                                        <>
                                            {p.name} — {formatCpf(p.cpf)}
                                        </>
                                    )}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Número da Conta</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="123456"
                                    inputMode="numeric"
                                    maxLength={12}
                                    {...field}
                                    onChange={(e) => {
                                        const only = e.target.value.replace(/\D/g, "");
                                        field.onChange(only);
                                    }}
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage/>
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
