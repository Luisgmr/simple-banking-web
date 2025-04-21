import React, { useState } from "react";
import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,} from "@/components/ui/pagination";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";

const range = (from: number, to: number) => {
    const result: number[] = [];
    for (let i = from; i <= to; i++) result.push(i);
    return result;
};

export type ColumnConfig<T> = {
    header: string;
    render: (item: T) => React.ReactNode;
    fill?: boolean;
    sortable?: boolean;
    sortKey?: keyof T;
};

export function PaginatedTable<T>({data, columns, currentPage, totalPages, onPageChange,}: {
    data: T[];
    columns: ColumnConfig<T>[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const [sortState, setSortState] = useState<{
        key: keyof T | null;
        direction: "asc" | "desc";
    }>({ key: null, direction: "asc" });

    const handleSort = (key: keyof T) => {
        setSortState((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const sortedData = React.useMemo(() => {
        if (!sortState.key) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortState.key!];
            const bVal = b[sortState.key!];
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortState.direction === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortState.direction === "asc" ? aVal - bVal : bVal - aVal;
            }
            return 0;
        });
    }, [data, sortState]);

    const pageNeighbours = 0;
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    let pages: (number | "LEFT_ELLIPSIS" | "RIGHT_ELLIPSIS")[] = [];

    if (totalPages <= totalBlocks) {
        pages = range(1, totalPages);
    } else {
        const leftBound = Math.max(2, currentPage - pageNeighbours);
        const rightBound = Math.min(totalPages - 1, currentPage + pageNeighbours);
        const showLeftEllipsis = leftBound > 2;
        const showRightEllipsis = rightBound < totalPages - 1;

        pages.push(1);
        if (showLeftEllipsis) pages.push("LEFT_ELLIPSIS");
        pages.push(...range(leftBound, rightBound));
        if (showRightEllipsis) pages.push("RIGHT_ELLIPSIS");
        pages.push(totalPages);
    }

    return sortedData.length > 0 ? (
        <div className="bg-white rounded-lg p-3">
            <div className="overflow-x-hidden">
                <Table className="w-full table-auto text-xs sm:text-sm">
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, idx) => {
                                const isActive = sortState.key === col.sortKey;
                                const direction = sortState.direction;
                                return (
                                    <TableHead
                                        key={idx}
                                        className={`${col.fill ? "w-full" : "w-fit"} ${
                                            col.sortable ? "cursor-pointer select-none" : ""
                                        }`}
                                        onClick={() => col.sortable && col.sortKey && handleSort(col.sortKey)}
                                    >
                                        <div className="flex items-center gap-1">
                                            {col.header}
                                            {col.sortable &&
                                                (isActive ? (
                                                    direction === "asc" ? (
                                                        <ArrowUp className="w-3 h-3" />
                                                    ) : (
                                                        <ArrowDown className="w-3 h-3" />
                                                    )
                                                ) : (
                                                    <ArrowUp className="w-3 h-3 opacity-20" />
                                                ))}
                                        </div>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((item, idx) => (
                            <TableRow key={idx}>
                                {columns.map((col, cidx) => (
                                    <TableCell key={cidx} className={col.fill ? "w-full" : "w-fit"}>
                                        {col.render(item)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <Pagination>
                        <PaginationContent>
                            {currentPage > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
                                </PaginationItem>
                            )}
                            {pages.map((page, idx) =>
                                page === "LEFT_ELLIPSIS" || page === "RIGHT_ELLIPSIS" ? (
                                    <PaginationItem key={idx}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={idx}>
                                        <PaginationLink
                                            onClick={() => onPageChange(page as number)}
                                            isActive={page === currentPage}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            )}
                            {currentPage < totalPages && (
                                <PaginationItem>
                                    <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    ) : (
        <div className="bg-white rounded-lg p-3">
            <p className="text-sm">Sem dados para exibir</p>
        </div>
    );
}
