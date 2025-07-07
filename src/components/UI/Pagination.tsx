"use client";

interface Props {
    page: number;
    total: number;
    onPage: (p: number) => void;
}

export default function Pagination({ page, total, onPage }: Props) {
    return (
        <div
            data-testid="pagination"
            className="flex items-center justify-center space-x-4"
        >
            <button
                data-testid="pagination-prev"
                disabled={page <= 1}
                aria-disabled={page <= 1}
                onClick={() => onPage(page - 1)}
                className="px-4 py-2 border border-[var(--neon)] rounded
                    transition enabled:hover:bg-[var(--neon)]
                    cursor-pointer disabled:cursor-not-allowed
                    disabled:opacity-50"
            >
                Prev
            </button>
            <span className="text-[var(--text-secondary)]">
                Page {page} / {total}
            </span>
            <button
                data-testid="pagination-next"
                disabled={page >= total}
                aria-disabled={page >= total}
                onClick={() => onPage(page + 1)}
                className="px-4 py-2 border border-[var(--neon)] rounded
                        transition enabled:hover:bg-[var(--neon)]
                        cursor-pointer disabled:cursor-not-allowed
                        disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
