'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SortArrow from '@/icons/SortArrow';
import SelectOptions from './SelectOptions';
import { useClickOutside } from '@/hooks/useClickOutside';

interface Option {
    value: string;
    label: string;
}

const OPTIONS: Option[] = [
    { value: '', label: 'None' },
    { value: 'title:asc', label: 'Title A - Z' },
    { value: 'title:desc', label: 'Title Z - A' },
    { value: 'artist:asc', label: 'Artist A - Z' },
    { value: 'artist:desc', label: 'Artist Z - A' },
    { value: 'album:asc', label: 'Album A - Z' },
    { value: 'album:desc', label: 'Album Z - A' },
    { value: 'createdAt:desc', label: 'New - Old' },
    { value: 'createdAt:asc', label: 'Old - New' },
];

interface Props {
    value: string;
    onChange: (v: string) => void;
}

export default function SortSelect({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, () => setOpen(false));

    const selectedLabel = OPTIONS.find(o => o.value === value)?.label || 'None';

    return (
        <div ref={ref} className="relative inline-block text-left">
            <motion.button
                onClick={() => setOpen(o => !o)}
                whileTap={{ scale: 0.96 }}
                className="flex w-48 items-center justify-between rounded-lg border border-[var(--neon)] px-4 py-2 text-[#bfb8e5] cursor-pointer"
                aria-haspopup="true"
                aria-expanded={open}
                data-testid="sort-select"
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
