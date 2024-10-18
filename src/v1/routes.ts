import {NextFunction, Request, Response, Router} from "express";

const router = Router()

// Home URL
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello world version 1')
});

export  default  router
