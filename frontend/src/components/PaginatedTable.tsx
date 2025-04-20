import React from "react";
import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const range = (from: number, to: number) => {
    const result = [];
    for (let i = from; i <= to; i++) result.push(i);
    return result;
};

export function PaginatedTable<T>({data, columns, currentPage, totalPages, onPageChange,}: {
    data: T[];
    columns: { header: string; render: (item: T) => React.ReactNode }[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const pageNeighbours = 1;
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    let pages: (number | 'LEFT_ELLIPSIS' | 'RIGHT_ELLIPSIS')[] = [];

    if (totalPages <= totalBlocks) {
        pages = range(1, totalPages);
    } else {
        const leftBound = Math.max(2, currentPage - pageNeighbours);
        const rightBound = Math.min(totalPages - 1, currentPage + pageNeighbours);
        const showLeftEllipsis = leftBound > 2;
        const showRightEllipsis = rightBound < totalPages - 1;

        pages.push(1);

        if (showLeftEllipsis) {
            pages.push('LEFT_ELLIPSIS');
        }

        const middlePages = range(leftBound, rightBound);
        pages.push(...middlePages);

        if (showRightEllipsis) {
            pages.push('RIGHT_ELLIPSIS');
        }

        pages.push(totalPages);
    }

    return data.length > 0 ? (
        <div className="bg-white rounded-lg p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col, idx) => (
                            <TableHead key={idx}>{col.header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, idx) => (
                        <TableRow key={idx}>
                            {columns.map((col, cidx) => (
                                <TableCell key={cidx}>{col.render(item)}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <Pagination>
                        <PaginationContent>
                            {currentPage > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
                                </PaginationItem>
                            )}

                            {pages.map((page, idx) => {
                                if (page === 'LEFT_ELLIPSIS' || page === 'RIGHT_ELLIPSIS') {
                                    return (
                                        <PaginationItem key={idx}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }
                                return (
                                    <PaginationItem key={idx}>
                                        <PaginationLink
                                            onClick={() => onPageChange(page as number)}
                                            isActive={page === currentPage}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

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
            <p className="text-sm">A conta selecionada ainda não possui extrato</p>
        </div>
    );
}