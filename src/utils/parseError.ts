export interface ApiErrorShape {
    data?: { error?: string };
    error?: string;
}

export function parseErrorMessage(err: unknown, fallback = 'Unexpected error'): string {
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;

    if (typeof err === 'object' && err !== null) {
        const e = err as ApiErrorShape;
        return e.data?.error ?? e.error ?? fallback;
    }

    return fallback;
}
