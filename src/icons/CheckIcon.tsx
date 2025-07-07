'use client'

import React from 'react'
import type { SVGProps } from 'react'

export default function CheckIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#bfb8e5"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
