export function formatTime(sec: number): string {
    if (sec < 0 || Number.isNaN(sec) || !Number.isFinite(sec)) {
        return '0:00';
    }

    const minutes = Math.floor(sec / 60).toString();
    const seconds = Math.floor(sec % 60)
        .toString()
        .padStart(2, '0');

    return `${minutes}:${seconds}`;
}
