"use client";

import { useEffect, useState } from "react";
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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import * as api from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/utils";

// validação Zod
const accountSchema = z.object({
    accountNumber: z.string().min(4, "Número obrigatório").regex(/^\d+$/, "Só dígitos"),
    ownerId: z.number().min(1, "Selecione a pessoa")
});
type AccountFormData = z.infer<typeof accountSchema>;

export interface AccountFormProps {
    initialData?: api.Account;
    onSuccess?: () => void;
}

export function AccountForm({ initialData, onSuccess }: AccountFormProps) {
    const form = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            accountNumber: initialData?.accountNumber ?? "",
            ownerId: initialData?.owner.id ?? undefined
        }
    });

    const [persons, setPersons] = useState<api.Person[]>([]);

    useEffect(() => {
        api
            .getPersons()
            .then(setPersons)
            .catch((e) => toastError(e.message));
        if (initialData) {
            form.reset({
                accountNumber: initialData.accountNumber,
                ownerId: initialData.owner.id
            });
        }
    }, [initialData, form]);

    const onSubmit = async (values: AccountFormData) => {
        try {
            if (initialData) {
                await api.updateAccount(initialData.id, values);
                toastSuccess("Conta atualizada com sucesso!");
            } else {
                await api.createAccount(values);
                toastSuccess("Conta criada com sucesso!");
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
                    name="ownerId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titular</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(v) => field.onChange(Number(v))}
                                    defaultValue={field.value?.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a pessoa" />
                                    </SelectTrigger>
                                    <SelectContent position={"popper"}>
                                        {persons.map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {p.name} — {p.cpf}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número da Conta</FormLabel>
                            <FormControl>
                                <Input placeholder="123456" {...field} />
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
