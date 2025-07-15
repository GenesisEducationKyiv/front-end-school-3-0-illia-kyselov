'use client'

import { motion } from 'framer-motion'

type Variant = 'pulse' | 'spinner'

interface Props {
    message: string
    variant?: Variant
    testId?: string
}

export default function EmptyState({
    message,
    variant = 'pulse',
    testId,
}: Props) {
    return (
        <motion.div
            data-testid={testId}
            className="flex flex-col items-center justify-center min-h-[750px] select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {variant === 'spinner' && (
                <motion.div
                    className="w-26 h-26 mb-6 rounded-full border-4
                        border-[#7a00ff] border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
                />
            )}

            <motion.span
                className="text-3xl font-semibold text-[#bfb8e5]"
                animate={
                    variant === 'pulse'
                        ? { scale: [1, 1.05, 1] }
                        : { scale: 1 }
                }
                transition={
                    variant === 'pulse'
                        ? { duration: 2, repeat: Infinity, repeatDelay: 2 }
                        : undefined
                }
            >
                {message}
            </motion.span>
        </motion.div>
    )
}
