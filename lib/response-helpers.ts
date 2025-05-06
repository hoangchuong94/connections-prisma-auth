export const successResponse = <T>(data: T, message = 'Operation successful.') => ({
    success: true,
    message,
    data,
    error: '',
});

export const errorResponse = (error: unknown, message = 'Operation failed.') => {
    const err = error as Error;
    return {
        success: false,
        message,
        data: null,
        error: err?.message || String(error) || 'Unknown error.',
        details: typeof error === 'object' ? error : undefined,
    };
};

export const executeWithCatch = async <T>(fn: () => Promise<T>) => {
    try {
        return await fn();
    } catch (err) {
        console.error('Error:', err);
        return errorResponse(err, 'Unexpected server error.');
    }
};

export const fetcher = async <T>(fn: () => Promise<{ success: boolean; data: T; error?: string }>): Promise<T> => {
    const { success, data, error } = await fn();
    if (!success) throw new Error(error || 'Fetch error');
    return data;
};
