import React from 'react'

type IconProps = React.SVGProps<SVGSVGElement>

export function PauseIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
        </svg>
    )
}
