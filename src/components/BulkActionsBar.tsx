'use client';

import React from 'react';
import TrashIcon from '@/icons/TrashIcon';

interface Props {
    total: number;
    selectedCount: number;
    onToggleAll(): void;
    onDeleteSelected(): void;
}

export default function BulkActionsBar({
    total,
    selectedCount,
    onToggleAll,
    onDeleteSelected,
}: Props) {
    if (total === 0) return null;

    return (
        <div className="ml-auto flex gap-4">
            <button
                data-testid="select-all"
                onClick={onToggleAll}
                className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--neon)] rounded-lg text-[#bfb8e5] cursor-pointer transition-colors duration-200 ease-in-out hover:border-[var(--neon)]"
            >
                {selectedCount === total ? 'Clear Selection' : 'Select All'}
            </button>

            {selectedCount > 0 && (
                <button
                    data-testid="bulk-delete-button"
                    onClick={onDeleteSelected}
                    className="flex items-center px-4 py-2 bg-[var(--card-bg)] border border-[var(--neon)] rounded-lg text-[#bfb8e5] cursor-pointer transition-colors duration-200 ease-in-out hover:border-red-600 hover:text-red-600"
                >
                    <TrashIcon width={20} height={20} className="mr-2 fill-current" />
                    Delete Selected {selectedCount}
                </button>
            )}
        </div>
    );
}
