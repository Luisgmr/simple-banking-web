"use client";

import { useEffect, useState } from "react";
import { Pen, Trash, X } from "phosphor-react";
import { PersonForm } from "./PersonForm";
import { toastError, toastSuccess } from "@/lib/utils";
import {getPaginatedPersons, deletePerson, PageResponse, Person} from "@/lib/api";
import { PaginatedTable } from "@/components/PaginatedTable";

export function PersonSection() {
    const [editing, setEditing] = useState<Person | null>(null);
    const [pageData, setPageData] = useState<PageResponse<Person>>({
        content: [],
        currentPage: 0,
        totalPages: 0,
        totalElements: 0
    });
    const pageSize = 5;

    async function loadPersons(page = 0) {
        try {
            const data = await getPaginatedPersons(page, pageSize);
            setPageData(data);
        } catch (e: any) {
            toastError(e.message);
        }
    }

    useEffect(() => {
        loadPersons(0);
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Deseja realmente excluir?")) return;
        try {
            await deletePerson(id);
            toastSuccess("Pessoa excluída");
            loadPersons(pageData.currentPage);
            if (editing?.id === id) setEditing(null);
        } catch (e: any) {
            toastError(e.message);
        }
    };

    const onPageChange = (newPage: number) => {
        const pageIndex = newPage - 1;
        loadPersons(pageIndex);
    };

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Pessoas</h1>

            {editing && (
                <div className="p-4 border rounded-lg relative bg-gray-50">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setEditing(null)}
                    >
                        <X size={20} />
                    </button>
                    <p className="font-medium">Editando:</p>
                    <p>
                        <strong>{editing.name}</strong> &mdash; {editing.cpf}
                    </p>
                </div>
            )}

            <PersonForm
                initialData={editing ?? undefined}
                onSuccess={() => {
                    setEditing(null);
                    loadPersons(pageData.currentPage);
                }}
            />

            <PaginatedTable<Person>
                data={pageData.content}
                currentPage={pageData.currentPage + 1}
                totalPages={pageData.totalPages}
                onPageChange={onPageChange}
                columns={[
                    { header: "ID", render: (p) => p.id },
                    { header: "Nome", render: (p) => p.name },
                    { header: "CPF", render: (p) => p.cpf },
                    { header: "Endereço", render: (p) => p.address },
                    {
                        header: "Ações",
                        noWrap: true,
                        render: (p) => (
                            <div className="flex gap-1">
                                <button
                                    className="flex p-2 rounded-md bg-blue-100 text-blue-600 cursor-pointer"
                                    onClick={() => setEditing(p)}
                                >
                                    <Pen weight="fill" className="w-5 h-auto shrink-0" />
                                </button>
                                <button
                                    className="flex p-2 rounded-md bg-red-100 text-red-600 cursor-pointer"
                                    onClick={() => handleDelete(p.id)}
                                >
                                    <Trash weight="fill" className="w-5 h-auto shrink-0" />
                                </button>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
}
