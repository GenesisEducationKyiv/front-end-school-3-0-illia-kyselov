'use client'

import React from 'react'

interface Props {
    list: string[]
    selected: string[]
    toggle: (g: string) => void
    error?: string
}

export default function GenreSelector({ list, selected, toggle, error }: Props) {
    return (
        <>
            <div className="flex flex-wrap gap-2" data-testid="genre-selector">
                {list.map(g => {
                    const disabled = selected.length === 3 && !selected.includes(g)
                    return (
                        <button
                            key={g}
                            type="button"
                            onClick={() => toggle(g)}
                            disabled={disabled}
                            className={[
                                'rounded-full border px-3 py-1 transition text-[#bfb8e5]',
                                !disabled && 'cursor-pointer',
                                selected.includes(g) ? 'bg-[var(--neon)]' : 'bg-transparent border-[var(--neon)]',
                                disabled && 'opacity-50 pointer-events-none',
                            ].filter(Boolean).join(' ')}
                        >
                            {g}
                        </button>
                    )
                })}
            </div>
            {error && <p className="text-red-500" data-testid="error-genre">{error}</p>}
        </>
    )
}
