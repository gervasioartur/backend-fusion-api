export class ConflictError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class UnexpectedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class  NotFoundError extends Error {
    constructor() {
        super('Resource not found');
    }
}

export class  BusinessError extends Error {
    constructor(message: string) {
        super(message);
    }
}