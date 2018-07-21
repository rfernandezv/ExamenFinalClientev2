
export class Response {
    httpStatus: string;
    message: string;
    errors: Error[];
}

export class Error {
    message : string;
    cause : string;
}
