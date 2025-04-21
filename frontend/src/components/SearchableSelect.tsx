"use client";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {useDebounce} from "@/lib/utils";
import {MagnifyingGlass} from "phosphor-react";
import {Loader2} from "lucide-react";
import React from "react";

export interface SearchableSelectProps<T> {
    value: string | undefined,
    onChange: (value: string) => void,
    selectPlaceholder?: string,
    searchPlaceholder?: string,
    fetchOptions: (q: string) => Promise<T[]>,
    renderOption: (option: T) => React.ReactNode,
    getOptionValue: (option: T) => string,
    debounceTime?: number,
    disabled?: boolean
}

export function SearchableSelect<T>({
    value,
    onChange,
    selectPlaceholder = "Selecione...",
    searchPlaceholder = "Pesquise...",
    fetchOptions,
    renderOption,
    getOptionValue,
    debounceTime = 500,
    disabled = false
}: SearchableSelectProps<T>) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const debouncedSearch = useDebounce(search, debounceTime);
    const [options, setOptions] = React.useState<T[]>([]);
    const [loading, setLoading] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        let active = true;
        setLoading(true);
        fetchOptions(debouncedSearch)
            .then((items) => {
                if (active) setOptions(items);
            })
            .catch(console.error)
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [debouncedSearch, fetchOptions]);

    React.useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [open]);

    return (
        <Select
            value={value}
            onValueChange={onChange}
            open={open}
            onOpenChange={setOpen}
            disabled={disabled}
        >
            <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder={selectPlaceholder}/>
            </SelectTrigger>

            <SelectContent position="popper" sideOffset={4}>
                <div className="p-2">
                    <Input
                        ref={inputRef}
                        icon={<MagnifyingGlass size={16} weight="bold"/>}
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setLoading(true)
                        }}
                        onKeyDown={(e) => {
                            e.stopPropagation();
                        }}
                    />
                </div>

                {loading && (
                    <div className="px-3 py-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <Loader2 className="animate-spin size-4"/>
                        <span>Buscando...</span>
                    </div>
                )}

                {!loading && options.length === 0 && (
                    <div className="px-3 py-1 text-sm text-muted-foreground">
                        Nenhum resultado encontrado
                    </div>
                )}

                {options.map((opt, idx) => {
                    const val = getOptionValue(opt);
                    return (
                        <SelectItem key={idx} value={val}>
                            {renderOption(opt)}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}
