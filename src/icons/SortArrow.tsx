import React from 'react';
import { motion } from 'framer-motion';

export default function SortArrow({ open }: { open: boolean }) {
    return (
        <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2"
        >
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" />
            </svg>
        </motion.span>
    );
}
