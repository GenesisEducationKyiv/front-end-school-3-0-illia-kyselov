import { ok, err, Result } from 'neverthrow';

export function parseErrorMessage(error: unknown): string {
    if (!error) {
        return 'error';
    }
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'object' && error !== null) {
        const errObj = error as { data?: { message?: unknown }; error?: unknown };
        if (typeof errObj.data?.message === 'string') {
            return errObj.data.message;
        }
        if (typeof errObj.error === 'string') {
            return errObj.error;
        }
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'error';
}

export async function toResult<T>(action: Promise<T>): Promise<Result<T, string>> {
    try {
        const data = await action;
        return ok(data);
    } catch (caught) {
        const message = parseErrorMessage(caught);
        return err(message);
    }
}
