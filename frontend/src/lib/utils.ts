import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toastError(message: string) {
  toast.error(message, { duration: 3000 });
}

export function toastSuccess(message: string) {
  toast.success(message, { duration: 3000 });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const h = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return debounced;
}

export function formatCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0,3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`
  return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9)}`
}

export function unformatCpf(formatted: string): string {
  return formatted.replace(/\D/g, "").slice(0, 11)
}

export function isValidCpf(cpf: string): boolean {
  const onlyNums = cpf.replace(/\D/g, "");
  if (onlyNums.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(onlyNums)) return false;

  const calcCheck = (digits: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < digits.length; i++) {
      total += Number(digits[i]) * (factor - i);
    }
    const mod = (total * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const firstVer = calcCheck(onlyNums.slice(0, 9), 10);
  const secondVer = calcCheck(onlyNums.slice(0, 10), 11);

  return firstVer === Number(onlyNums[9]) && secondVer === Number(onlyNums[10]);
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
}
