class ErrorResponse extends Error {

    statusCode: number;
    code?: number | string;

    constructor(message: string, statusCode: number, code?: number | string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorResponse)
        }
    }

}

export default ErrorResponse