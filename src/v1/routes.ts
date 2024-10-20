import { Router} from "express";
import { makePlanetController } from '@/v1/api/factories/controller-factory';
import { createPlanetValidator } from '@/v1/api/validators';

const router = Router()
const planetController = makePlanetController()

// Planet Routes
router.post('/planets',createPlanetValidator, planetController.create)
router.get('/planets', planetController.readAll)
router.get('/planets/:id', planetController.readById)
router.put('/planets/:id', planetController.update)
router.delete('/planets/:id', planetController.delete)

export  default  router
