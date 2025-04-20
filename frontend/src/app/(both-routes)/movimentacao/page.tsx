// src/app/movimentacao/page.tsx
"use client";

import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    getPersons,
    getTransactions,
    createTransaction,
    Person,
    Account,
    Transaction,
    getAccount, PageResponse, getAccountsByPerson
} from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {MoneyInput} from "@/components/ui/money-input";
import { PaginatedTable } from "@/components/PaginatedTable";
import {Wallet} from "phosphor-react";
import {formatCurrency, toastError, toastSuccess} from "@/lib/utils";


const requiredValueMessage: string = "Campo obrigatório";

const schema = z.object({
    personId: z.number({required_error: requiredValueMessage}),
    accountId: z.number({ required_error: requiredValueMessage }),
    amount: z.number({ required_error: requiredValueMessage })
        .positive("Insira um valor válido. Deve ser maior que zero"),
    type: z.enum(["DEPOSIT", "WITHDRAW"]),
});

type FormData = z.infer<typeof schema>;

export default function TransactionPage() {
    const [persons, setPersons] = useState<Person[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

    const [pageData, setPageData] = useState<PageResponse<Transaction>>(null!);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 5;

    async function loadTransactions(accountId: number, page = 0) {
        const data = await getTransactions(accountId, page, pageSize);
        setPageData(data);
    }

    useEffect(() => {
        getPersons().then(setPersons);
    }, []);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { personId: undefined, accountId: undefined, amount: undefined, type: "DEPOSIT" },
    });

    const onPersonChange = async (personId: number, values: FormData) => {
        form.reset({ ...values, amount: undefined });
        form.setValue("personId", personId);
        setAccounts(await getAccountsByPerson(personId));
        setSelectedAccount(null)
    };

    const onAccountChange = async (accountId: number) => {
        form.setValue("accountId", accountId);
        setCurrentPage(0);
        await loadTransactions(accountId, 0);
        setSelectedAccount(await getAccount(accountId));
    };

    const onPageChange = (newPage: number) => {
        setCurrentPage(newPage - 1);
        loadTransactions(selectedAccount!.id, newPage - 1);
    };

    const onSubmit = async (values: FormData) => {
        try {
            await createTransaction(values.accountId, { amount: values.amount, type: values.type });
            toastSuccess("Movimentação realizada com sucesso!");

            form.setValue("amount", 0)
            onPageChange(1)

            getAccountsByPerson(values.personId)
                .then((personAccounts) => {
                    setAccounts(personAccounts);
                    const updatedAccount = personAccounts.find((account) => account.id === values.accountId) ?? null;
                    setSelectedAccount(updatedAccount);
                })
                .catch((e) => {
                    toastError("Não foi possível recarregar as contas");
                    console.error(e);
                });
        } catch (error: any) {
            toastError(
                error.response?.data?.message
                ?? error.message
                ?? "Erro ao cadastrar a movimentação. Tente novamente mais tarde"
            );
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-md font-bold">Cadastro de Movimentação</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col rounded-lg p-4 gap-3 bg-white shadow-custom">
                    <div className={"grid grid-cols-1 sm:grid-cols-2 gap-2 items-start"}>
                        <FormField
                            control={form.control}
                            name="personId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pessoa</FormLabel>
                                    <Select
                                        onValueChange={(val) => {
                                            const id = Number(val);
                                            field.onChange(id);
                                            onPersonChange(id, form.getValues());
                                        }}
                                        value={field.value?.toString()}
                                        defaultValue={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione pessoa" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {persons.map((p) => (
                                                <SelectItem key={p.id} value={p.id.toString()}>
                                                    {p.name} - {p.cpf}
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
                            name="accountId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Conta</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(val) => {
                                                const id = Number(val);
                                                field.onChange(id);
                                                onAccountChange(id);
                                            }}
                                            value={field.value?.toString()}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a conta" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" sideOffset={4}>
                                                {accounts.map((account) => (
                                                    <SelectItem key={account.id} value={account.id.toString()}>
                                                        {account.accountNumber} - Saldo: {formatCurrency(account.balance)}
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
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo</FormLabel>
                                    <Select onValueChange={(v) => field.onChange(v)} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="DEPOSIT">Depositar</SelectItem>
                                            <SelectItem value="WITHDRAW">Retirar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor</FormLabel>
                                    <FormControl>
                                        <MoneyInput
                                            value={field.value}
                                            onValueChange={(v) => field.onChange(v)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className={"flex gap-2"}>
                        <div className={"flex w-fit"}>
                            <Button className={"!px-20"} type="submit">Salvar</Button>
                        </div>
                        {selectedAccount != null && (
                            <div className={`rounded-md p-2 flex gap-1 items-center ${selectedAccount.balance > 0 ? `bg-green-100 text-green-600` : `bg-yellow-100 text-yellow-600`}`}>
                                <Wallet className={"w-4 h-auto shrink-0 "} weight={"fill"}/>
                                <p className={"text-xs font-bold "}>{formatCurrency(selectedAccount.balance)} de saldo</p>
                            </div>
                        )
                        }
                    </div>


                </form>
            </Form>

            {selectedAccount &&
                <div className={"flex flex-col gap-2"}>
                    <h2 className="text-md font-semibold">Extrato</h2>
                    <PaginatedTable<Transaction>
                        data={pageData.content}
                        columns={[
                            {
                                header: "Data",
                                render: (transaction) => new Date(transaction.timestamp).toLocaleString()
                            },
                            {
                                header: "Valor",
                                render: (transaction) => (
                                    <span className={transaction.type === "WITHDRAW" ? "text-red-600" : "text-green-600"}>
                                {transaction.type === "WITHDRAW" ? "- " : "+ "}{formatCurrency(transaction.amount)}
                            </span>
                                ),
                            },
                        ]}
                        currentPage={pageData.currentPage + 1}
                        totalPages={pageData.totalPages}
                        onPageChange={onPageChange}
                    />
                </div>}

        </div>
    );
}
