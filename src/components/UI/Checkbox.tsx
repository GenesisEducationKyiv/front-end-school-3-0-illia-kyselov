'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CheckIcon from '@/icons/CheckIcon'

interface CheckboxProps {
    checked: boolean
    onChange: (checked: boolean) => void
    testId?: string
}

export default function Checkbox({
    checked,
    onChange,
    testId,
}: CheckboxProps) {
    return (
        <motion.label
            className="inline-flex items-center cursor-pointer"
            whileTap={{ scale: 0.9 }}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className="sr-only"
                data-testid={testId}
            />

            <motion.span
                initial={false}
                animate={{
                    backgroundColor: checked
                        ? 'var(--neon)'
                        : 'transparent',
                }}
                transition={{ type: 'tween', duration: 0.2 }}
                className={`w-5 h-5 border-2 border-[var(--neon)] rounded flex items-center justify-center`}
            >
                <AnimatePresence>
                    {checked && (
                        <motion.div
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <CheckIcon className="w-3 h-3 text-black" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.span>
        </motion.label>
    )
}
