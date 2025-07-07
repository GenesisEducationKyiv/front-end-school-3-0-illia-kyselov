'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SortArrow from '@/icons/SortArrow';
import SelectOptions from './SelectOptions';
import { useClickOutside } from '@/hooks/useClickOutside';

interface Props {
    list: string[];
    value: string;
    onChange: (v: string) => void;
}

export default function GenreSelect({ list, value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const OPTIONS = [
        { value: '', label: 'All Genres' },
        ...list.map(g => ({ value: g, label: g })),
    ];

    useClickOutside(ref, () => setOpen(false));

    const selectedLabel =
        OPTIONS.find(o => o.value === value)?.label || 'All Genres';

    return (
        <div
            ref={ref}
            className="relative inline-block w-48 text-left text-[#bfb8e5] cursor-pointer"
        >
            <motion.button
                onClick={() => setOpen(o => !o)}
                whileTap={{ scale: 0.96 }}
                className="flex w-full items-center justify-between rounded-lg border border-[var(--neon)] bg-[var(--card-bg)] px-4 py-2 cursor-pointer"
                aria-haspopup="true"
                aria-expanded={open}
                data-testid="filter-genre"
            >
                <span className="truncate">{selectedLabel}</span>
                <SortArrow open={open} />
            </motion.button>

            <AnimatePresence>
                {open && (
                    <SelectOptions
                        options={OPTIONS}
                        selectedValue={value}
                        onSelect={v => {
                            onChange(v);
                            setOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
