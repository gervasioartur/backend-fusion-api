import request from 'supertest';
import express from 'express';
import { createPlanetFromDtoFactory, createPlanetRequestFactory } from '@/tests/v1/mocks/planet-mocks';
import { PlanetController } from '@/v1/api/controllers/planet.controller';
import { PlanetService } from '@/v1/service/contract/planet.service';
import { createPlanetValidator } from '@/v1/api/validators';

const mockPlanetService = { create: jest.fn() } as unknown as PlanetService;

const createApp = () => {
  const app = express();
  app.use(express.json());

  const planetController = new PlanetController(mockPlanetService);
  app.post('/planets',createPlanetValidator, planetController.create);

  return app;
};

describe('PlanetController', () => {
  it('should return 400 if name is empty or null', async () => {
    const requestParams = createPlanetRequestFactory();
    requestParams.name = "";

    const app = createApp();
    const response = await request(app)
      .post('/planets')
      .send(requestParams)
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      message: "Validation Error",
      body: ["Name is required"]
    });
    expect(mockPlanetService.create).toHaveBeenCalledTimes(0)
  });

  it('should return 400 if climate is empty or null', async () => {
    const requestParams = createPlanetRequestFactory();
    requestParams.climate = "";

    const app = createApp();
    const response = await request(app)
      .post('/planets')
      .send(requestParams)
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      message: "Validation Error",
      body: ["Climate is required"]
    });
    expect(mockPlanetService.create).toHaveBeenCalledTimes(0)
  });

  it('should create a new planet and return status 201', async () => {
    const requestParams = createPlanetRequestFactory();
    const planet = createPlanetFromDtoFactory(requestParams);

    (mockPlanetService.create as jest.Mock).mockResolvedValue(undefined);

    const app = createApp();
    const response = await request(app)
      .post('/planets')
      .send(requestParams)
      .expect(201);

    expect(response.body).toEqual({
      status: 201,
      message: 'Planet successfully saved!',
    });
    expect(mockPlanetService.create).toHaveBeenCalledWith(planet);
    expect(mockPlanetService.create).toHaveBeenCalledTimes(1)
  });
});
