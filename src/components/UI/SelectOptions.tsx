import React from 'react';
import { motion } from 'framer-motion';

interface Option {
    value: string;
    label: string;
}

interface Props {
    options: Option[];
    selectedValue: string;
    onSelect: (v: string) => void;
}

export default function SelectOptions({ options, selectedValue, onSelect }: Props) {
    return (
        <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-[#060a0d] border border-[var(--neon)] rounded-lg shadow-lg overflow-hidden text-[#bfb8e5]"
        >
            {options.map((opt) => (
                <motion.li
                    key={opt.value}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    onClick={() => onSelect(opt.value)}
                    className={`px-4 py-2 cursor-pointer ${opt.value === selectedValue ? 'font-semibold text-purple-700' : ''} border-b border-[var(--neon)]`}
                >
                    {opt.label}
                </motion.li>
            ))}
        </motion.ul>
    );
}
