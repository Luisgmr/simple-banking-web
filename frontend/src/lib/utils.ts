import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toastError(message: string) {
  toast.error(message, { duration: 3000 });
}

export function toastSuccess(message: string) {
  toast.success(message, { duration: 3000 });
}

export function toastWarn(message: string) {
  toast(message, {
    style: {
      background: "#F9F6E9",
      color: "#D3A928",
    },
  });
}

export function toastInfo(message: string) {
  toast(message, {
    style: {
      background: "#E6F4FF",
      color: "#0091FF",
    },
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
