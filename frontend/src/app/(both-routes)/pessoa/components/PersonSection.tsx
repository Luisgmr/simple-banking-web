"use client";

import { useEffect, useState } from "react";
import { X } from "phosphor-react";
import { PersonForm } from "./PersonForm";
import * as api from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/utils";

export function PersonSection() {
    const [list, setList] = useState<api.Person[]>([]);
    const [editing, setEditing] = useState<api.Person | null>(null);

    // carrega lista
    useEffect(() => {
        api.getPersons().then(setList).catch((e) => toastError(e.message));
    }, []);

    const refresh = () =>
        api
            .getPersons()
            .then(setList)
            .catch((e) => toastError(e.message));

    const handleDelete = async (id: number) => {
        if (!confirm("Deseja realmente excluir?")) return;
        try {
            await api.deletePerson(id);
            toastSuccess("Pessoa excluída");
            refresh();
            if (editing?.id === id) setEditing(null);
        } catch (e: any) {
            toastError(e.message);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-semibold">Pessoas</h1>

            {/* Card de edição */}
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
                        <strong>{editing.name}</strong> — {editing.cpf}
                    </p>
                </div>
            )}

            {/* Formulário: cria ou edita */}
            <PersonForm
                initialData={editing ?? undefined}
                onSuccess={() => {
                    setEditing(null);
                    refresh();
                }}
            />

            {/* Lista abaixo */}
            <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Nome</th>
                    <th className="p-2 border">CPF</th>
                    <th className="p-2 border">Endereço</th>
                    <th className="p-2 border">Ações</th>
                </tr>
                </thead>
                <tbody>
                {list.map((p) => (
                    <tr key={p.id}>
                        <td className="p-2 border">{p.id}</td>
                        <td className="p-2 border">{p.name}</td>
                        <td className="p-2 border">{p.cpf}</td>
                        <td className="p-2 border">{p.address}</td>
                        <td className="p-2 border space-x-2">
                            <button
                                className="text-blue-600 hover:underline"
                                onClick={() => setEditing(p)}
                            >
                                Editar
                            </button>
                            <button
                                className="text-red-600 hover:underline"
                                onClick={() => handleDelete(p.id)}
                            >
                                Excluir
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
