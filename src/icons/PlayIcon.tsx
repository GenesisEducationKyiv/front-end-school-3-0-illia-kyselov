import React from 'react'

type IconProps = React.SVGProps<SVGSVGElement>

export function PlayIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path d="M4 3l16 9L4 21V3z" />
        </svg>
    )
}
