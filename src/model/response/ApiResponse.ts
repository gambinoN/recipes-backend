export class ApiResponse<T> {
    data: T | null;
    error: string | null;

    constructor(data: T | null = null, error: string | null = null) {
        this.data = data;
        this.error = error;
    }
}