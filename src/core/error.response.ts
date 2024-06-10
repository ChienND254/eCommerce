import {StatusCodes, ReasonPhrases} from '../utils/httpStatusCode'
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
    constructor(message:string = ReasonStatusCode.CONFLICT, statusCode:number = StatusCode.CONFLICT) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message:string = ReasonStatusCode.CONFLICT, statusCode:number = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message:string = ReasonPhrases.UNAUTHORIZED, statusCode:number = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message:string = ReasonPhrases.NOT_FOUND, statusCode:number = StatusCodes.NOT_FOUND) {
        super(message, statusCode)
    }
}
export {
    ConflictRequestError, 
    BadRequestError,
    AuthFailureError,
    NotFoundError,
}