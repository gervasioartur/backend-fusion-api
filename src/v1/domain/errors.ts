export class Errors extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class  UnexpectError extends Error {
    constructor(message: string) {
        super(message);
    }
}