const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: "bad request error",
    CONFLICT: "Conflict Error"
}
class ErrorResponse extends Error {
    status: number;
    constructor(message:string, status:number) {
        super(message);
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message:string = ReasonStatusCode.CONFLICT, statusCode:number = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message:string = ReasonStatusCode.CONFLICT, statusCode:number = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

export {ConflictRequestError, BadRequestError}