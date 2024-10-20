import { createPlanetValidator } from '@/v1/api/validators';
import { PlanetController } from '@/v1/api/controllers/planet.controller';
import { PlanetService } from '@/v1/service/contract/planet.service';
import { Router } from 'express';

export const mockPlanetService =
  { create: jest.fn(),
    readAll: jest.fn()
  } as unknown as jest.Mocked<PlanetService>;

const routerMock = Router()
const planetController = new PlanetController(mockPlanetService);

// Planet Routes
routerMock.post('/planets',createPlanetValidator, planetController.create)
routerMock.get('/planets', planetController.readAll)

export  default  routerMock
