import {NextFunction, Request, Response, Router} from "express";
import { makePlanetController } from '@/v1/api/factories/controller-factory';
import { createPlanetValidator } from '@/v1/api/validators';

const router = Router()
const planetController = makePlanetController()


// Home ROUTE
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello world version 1')
});

// Planet Routes
router.post('/planets',createPlanetValidator, planetController.create)

export  default  router
