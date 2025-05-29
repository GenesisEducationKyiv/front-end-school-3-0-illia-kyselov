'use client'
import { ReactNode } from 'react'
import {
    motion,
    useMotionValue,
    useTransform,
    useAnimationFrame,
} from 'framer-motion'

export default function NeonPanel({ children }: { children: ReactNode }) {
    const rot = useMotionValue(0)
    useAnimationFrame((t) => rot.set((t / 20000) * 360))

    const bg = useTransform(
        rot,
        (r) =>
            `conic-gradient(from ${r}deg, rgba(122,0,255,0.7) 0 60deg, transparent 60deg)`
    )

    return (
        <div className="relative">
            <motion.div
                aria-hidden
                className="absolute -inset-[3px] rounded-lg z-0"
                style={{ background: bg, filter: 'blur(10px)' }}
            />
            <div className="relative z-10 bg-[#03070af6] border border-[#281a63] rounded-lg p-6 space-y-6">
                {children}
            </div>
        </div>
    )
}
