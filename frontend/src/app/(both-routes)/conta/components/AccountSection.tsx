"use client";

import { useEffect, useState } from "react";
import { X } from "phosphor-react";
import { AccountForm } from "./AccountForm";
import * as api from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/utils";

export function AccountSection() {
    const [list, setList] = useState<api.Account[]>([]);
    const [editing, setEditing] = useState<api.Account | null>(null);

    useEffect(() => {
        api.getAccounts().then(setList).catch((e) => toastError(e.message));
    }, []);

    const refresh = () =>
        api
            .getAccounts()
            .then(setList)
            .catch((e) => toastError(e.message));

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-semibold">Contas</h1>

            {editing && (
                <div className="p-4 border rounded-lg relative bg-gray-50">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setEditing(null)}
                    >
                        <X size={20} />
                    </button>
                    <p className="font-medium">Editando conta #{editing.id}</p>
                    <p>
                        Titular: <strong>{editing.owner.name}</strong>
                    </p>
                </div>
            )}

            <AccountForm
                initialData={editing ?? undefined}
                onSuccess={() => {
                    setEditing(null);
                    refresh();
                }}
            />

            <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Número</th>
                    <th className="p-2 border">Titular</th>
                    <th className="p-2 border">Saldo</th>
                    <th className="p-2 border">Ações</th>
                </tr>
                </thead>
                <tbody>
                {list.map((c) => (
                    <tr key={c.id}>
                        <td className="p-2 border">{c.id}</td>
                        <td className="p-2 border">{c.accountNumber}</td>
                        <td className="p-2 border">{c.owner.name}</td>
                        <td className="p-2 border">{c.balance.toFixed(2)}</td>
                        <td className="p-2 border space-x-2">
                            <button
                                className="text-blue-600 hover:underline"
                                onClick={() => setEditing(c)}
                            >
                                Editar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
