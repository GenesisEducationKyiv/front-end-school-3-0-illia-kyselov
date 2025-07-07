'use client'

import React, { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export default function Input(props: InputProps) {
    const { className = '', ...rest } = props

    return (
        <input
            {...rest}
            className={`
                px-4 py-2
                border border-[var(--neon)]
                rounded-lg
                placeholder-[#bfb8e5] placeholder-opacity-30
                focus:outline-none focus:border-[var(--neon)]
                ${className}
            `}
        />
    )
}
