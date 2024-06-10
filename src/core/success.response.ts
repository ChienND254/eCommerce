import { Response } from "express";
import {StatusCodes, ReasonPhrases} from '../utils/httpStatusCode'

interface SuccessResponseOptions {
    message?: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: any;
    options?: any;
}
class SuccessResponse {
    message: string;
    status: number;
    metadata: Record<string, any>;
    options: any;
    constructor({message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK , metadata = {}}: SuccessResponseOptions) {
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res: Response, headers: Record<string, any> = {}): void {
        res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }: SuccessResponseOptions) {
        super({ message, metadata });
    }
}

class CREATED extends SuccessResponse {
    constructor({ options={}, message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata }: SuccessResponseOptions) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options
    }
}

export {OK, CREATED, SuccessResponse}