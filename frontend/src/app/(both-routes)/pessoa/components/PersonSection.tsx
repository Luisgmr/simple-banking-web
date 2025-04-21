"use client";

import { useEffect, useState } from "react";
import {Pen, Trash, Users, X} from "phosphor-react";
import { PersonForm } from "./PersonForm";
import {formatCpf, toastError, toastSuccess} from "@/lib/utils";
import {getPaginatedPersons, deletePerson, PageResponse, Person} from "@/lib/api";
import { PaginatedTable } from "@/components/PaginatedTable";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import { motion } from "framer-motion";

export function PersonSection() {
    const [editing, setEditing] = useState<Person | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [toDelete, setToDelete] = useState<Person | null>(null);
    const [formKey, setFormKey] = useState(0);
    const [pageData, setPageData] = useState<PageResponse<Person>>({
        content: [],
        currentPage: 0,
        totalPages: 0,
        totalElements: 0
    });
    const pageSize = 5;

    const onPageChange = (newPage: number) => {
        const pageIndex = newPage - 1;
        loadPersons(pageIndex);
    };

    function confirmDelete(person: Person) {
        setToDelete(person);
        setDialogOpen(true);
    }

    async function loadPersons(page = 0) {
        try {
            const data = await getPaginatedPersons(page, pageSize);
            setPageData(data);
        } catch (e: any) {
            toastError(e.message);
        }
    }

    async function handleDelete() {
        if (!toDelete) return;
        try {
            await deletePerson(toDelete.id).then(() =>
                {
                    toastSuccess("Pessoa excluída");
                    onPageChange(1)
                }
            );
            if (editing?.id === toDelete.id) setEditing(null);
        } catch (e: any) {
            toastError(e.message);
        } finally {
            setDialogOpen(false);
            setToDelete(null);
        }
    }

    useEffect(() => {
        loadPersons(0);
    }, []);

    return (
        <div className="flex flex-col gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Deseja realmente excluir “{toDelete?.name}”? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <h1 className="text-md font-bold">Pessoas</h1>

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
                    <p className="font-medium">Editando:</p>
                    <p>
                        <strong>{editing.name}</strong> &mdash; {editing.cpf}
                    </p>
                </motion.div>
            ) : (
                <div className="p-4 rounded-lg bg-white flex items-center gap-2">
                    <Users size={22} weight={"fill"} />
                    <h1 className="text-md font-bold">Cadastrando uma pessoa</h1>
                </div>
            )}

            <div className={"flex flex-col rounded-lg p-4 bg-white shadow-custom"}>
                <PersonForm
                    key={`form-${formKey}`}
                    initialData={editing ?? undefined}
                    onSuccess={() => {
                        setEditing(null);
                        loadPersons(pageData.currentPage);
                        setFormKey(prev => prev + 1)
                    }}
                />
            </div>

            <PaginatedTable<Person>
                data={pageData.content}
                currentPage={pageData.currentPage + 1}
                totalPages={pageData.totalPages}
                onPageChange={onPageChange}
                columns={[
                    { header: "Nome", render: (p) => p.name },
                    { header: "CPF", render: (p) => formatCpf(p.cpf) },
                    { header: "Endereço", fill: true, render: (p) => p.address },
                    {
                        header: "Ações",
                        render: (person) => (
                            <div className="flex gap-1">
                                <motion.button
                                    whileTap={{scale:0.95}}
                                    whileHover={{ scale:1.05 }}
                                    className="flex p-2 rounded-md bg-blue-100 text-blue-600 cursor-pointer"
                                    onClick={() => setEditing(person)}
                                >
                                    <Pen weight="fill" className="w-5 h-auto shrink-0" />
                                </motion.button>
                                <motion.button
                                    whileTap={{scale:0.95}}
                                    whileHover={{ scale:1.05 }}
                                    className="flex p-2 rounded-md bg-red-100 text-red-600 cursor-pointer"
                                    onClick={() => confirmDelete(person)}
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
