import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
    : "/api";

export const api = axios.create({
    baseURL: BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const msg =
            err.response?.data?.message ||
            err.response?.statusText ||
            err.message;
        return Promise.reject(new Error(msg));
    }
);

export type PageResponse<T> = {
    content: T[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
};

export type Person = {
    id: number;
    name: string;
    cpf: string;
    address: string;
};

export type Account = {
    id: number;
    accountNumber: string;
    owner: Person
    balance: number;
};

export type Transaction = {
    id: number;
    accountId: number;
    timestamp: string;
    amount: number;
    type: "DEPOSIT" | "WITHDRAW";
};

export async function getPaginatedPersons(
    page = 0,
    size = 5
): Promise<PageResponse<Person>> {
    const res = await api.get(`/persons`, {
        params: {page, size}
    });
    return res.data;
}

export const getPersons = async (): Promise<Person[]> => {
    const { data } = await api.get<Person[]>("/persons");
    return data;
};

export const createPerson = async (
    p: Omit<Person, "id">
): Promise<Person> => {
    const { data } = await api.post<Person>("/persons", p);
    return data;
};

export const updatePerson = async (
    id: number,
    p: Omit<Person, "id">
): Promise<Person> => {
    const { data } = await api.put<Person>(`/persons/${id}`, p);
    return data;
};

export const deletePerson = async (id: number): Promise<void> => {
    await api.delete(`/persons/${id}`);
};

export const getAccounts = async (): Promise<Account[]> => {
    const { data } = await api.get<Account[]>("/accounts");
    return data;
};

export const getAccountsByPerson = async (accountId: number): Promise<Account[]> => {
    const { data } = await api.get<Account[]>(`/persons/${accountId}/accounts`);
    return data;
};


export const getAccount = async (accountId: number): Promise<Account> => {
    const { data } = await api.get<Account>("/accounts/" + accountId);
    return data;
};

export const createAccount = async (a: {
    accountNumber: string;
    ownerId: number;
}): Promise<Account> => {
    const { data } = await api.post<Account>("/accounts", a);
    return data;
};

export const updateAccount = async (
    id: number,
    a: Partial<{
        accountNumber: string;
        ownerId: number;
    }>
): Promise<Account> => {
    const { data } = await api.put<Account>(`/accounts/${id}`, a);
    return data;
};

export const deleteAccount = async (id: number): Promise<void> => {
    await api.delete(`/accounts/${id}`);
};

export async function getTransactions(
    accountId: number,
    page = 0,
    size = 5
): Promise<PageResponse<Transaction>> {
    const res = await api.get(`/transactions/` + accountId, {
        params: { page, size }
    });
    return res.data;
}

export const createTransaction = async (
    accountId: number,
    payload: { amount: number; type: "DEPOSIT" | "WITHDRAW" }
): Promise<Transaction> => {
    const { data } = await api.post<Transaction>(
        `/transactions/${accountId}`,
        payload
    );
    return data;
};
