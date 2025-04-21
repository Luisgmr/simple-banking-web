"use client"

import { forwardRef, InputHTMLAttributes } from "react"
import { Input } from "./input"

export interface MoneyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
    value: number
    onValueChange: (value: number) => void
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
    ({ value, onValueChange, ...props }, ref) => {
        const formatted = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value ?? 0)

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const digits = e.target.value.replace(/\D/g, "")
            const numeric = parseInt(digits || "0", 10) / 100
            onValueChange(numeric)
        }

        return (
            <Input
                {...props}
                ref={ref}
                value={formatted}
                onChange={handleChange}
            />
        )
    }
)

MoneyInput.displayName = "MoneyInput"
