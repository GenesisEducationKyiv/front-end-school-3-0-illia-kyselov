export function formatTime(sec: number): string {
    const minutes = Math.floor(sec / 60)
        .toString()
        .padStart(1, '0')
    const seconds = Math.floor(sec % 60)
        .toString()
        .padStart(2, '0')
    return `${minutes}:${seconds}`
}
