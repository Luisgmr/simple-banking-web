"use client";

import React, { useEffect, useState } from "react";
import {Bank, Pen, Trash, X} from "phosphor-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {formatCpf, formatCurrency, toastError, toastSuccess} from "@/lib/utils";
import * as api from "@/lib/api";
import { AccountForm } from "./AccountForm";
import { PaginatedTable } from "@/components/PaginatedTable";
import { motion } from "framer-motion";

export function AccountSection() {
    const [editing, setEditing] = useState<api.Account | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [toDelete, setToDelete] = useState<api.Account | null>(null);
    const [formKey, setFormKey] = useState(0);
    const [pageData, setPageData] = useState<api.PageResponse<api.Account>>({
        content: [],
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
    });
    const pageSize = 5;

    async function loadAccounts(page = 0) {
        try {
            const data = await api.getPaginatedAccounts(page, pageSize);
            setPageData(data);
        } catch (e: any) {
            toastError(e.message);
        }
    }

    function confirmDelete(account: api.Account) {
        setToDelete(account);
        setDialogOpen(true);
    }

    async function handleDelete() {
        if (!toDelete) return;
        try {
            await api.deleteAccount(toDelete.id);
            toastSuccess("Conta removida");
            await loadAccounts(pageData.currentPage);
            if (editing?.id === toDelete.id) setEditing(null);
        } catch (e: any) {
            toastError(e.message);
        } finally {
            setDialogOpen(false);
            setToDelete(null);
        }
    }

    function onPageChange(newPage: number) {
        loadAccounts(newPage - 1);
    }

    useEffect(() => {
        loadAccounts(0);
    }, []);

    return (
        <div className="flex flex-col gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                            Deseja realmente remover a conta #{toDelete?.accountNumber}? Esta ação não
                            pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Remover
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <h1 className="text-md font-bold">Contas</h1>

            {editing ? (
                <motion.div
                    className="p-4 border rounded-lg relative bg-blue-100"
                    initial={{ opacity: 0, scale: 0.5}}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.5, scale: 0.5 }}
                    transition={{type: "spring", stiffness: 500, damping: 25}}
                >
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={() => {
                            setEditing(null)
                            setFormKey(prev => prev + 1)
                        }}
                    >
                        <X size={20} className={"cursor-pointer"} />
                    </button>
                    <p className="font-medium">Editando conta:</p>
                    <p>
                        <strong>#{editing.accountNumber}</strong> &mdash; {editing.owner.name}
                    </p>
                </motion.div>
            ) : (
                <div className="p-4 rounded-lg bg-white flex items-center gap-2">
                    <Bank size={22} weight="fill" />
                    <h1 className="text-md font-bold">Cadastrando uma conta</h1>
                </div>
            )}

            <div className="p-4 bg-white rounded-lg shadow-custom">
                <AccountForm
                    key={`form-${formKey}`}
                    initialData={editing ?? undefined}
                    onSuccess={() => {
                        setEditing(null);
                        loadAccounts(pageData.currentPage);
                    }}
                    resetForm={() => setFormKey(prev => prev + 1)}
                />
            </div>

            <PaginatedTable<api.Account>
                data={pageData.content}
                currentPage={pageData.currentPage + 1}
                totalPages={pageData.totalPages}
                onPageChange={onPageChange}
                columns={[
                    {
                        header: "Nome",
                        render: (c) => `${c.owner.name}`,
                    },
                    {
                        header: "CPF",
                        render: (c) => `${formatCpf(c.owner.cpf)}`
                    },
                    { header: "Número da conta", render: (c) => c.accountNumber },
                    {
                        header: "Saldo",
                        render: (c) => formatCurrency(c.balance),
                    },
                    {
                        header: "Ações",
                        render: (account) => (
                            <div className="flex gap-1">
                                <motion.button
                                    whileTap={{scale:0.95}}
                                    whileHover={{ scale:1.05 }}
                                    className="flex p-2 rounded-md bg-blue-100 text-blue-600 cursor-pointer"
                                    onClick={() => setEditing(account)}
                                >
                                    <Pen weight="fill" className="w-5 h-auto shrink-0" />
                                </motion.button>
                                <motion.button
                                    whileTap={{scale:0.95}}
                                    whileHover={{ scale:1.05 }}
                                    className="flex p-2 rounded-md bg-red-100 text-red-600 cursor-pointer"
                                    onClick={() => confirmDelete(account)}
                                >
                                    <Trash weight="fill" className="w-5 h-auto shrink-0" />
                                </motion.button>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
}
