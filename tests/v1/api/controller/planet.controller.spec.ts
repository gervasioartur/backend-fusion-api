import request from 'supertest';
import { createPlanetFromDtoFactory, createPlanetRequestFactory } from '@/tests/v1/mocks/planet-mocks';
import { ConflictError } from '@/v1/domain/errors';
import { mockPlanetService } from '@/tests/v1/mocks/routes-mock';
import appMock from '@/tests/v1/mocks/app-mock';

describe('PlanetController', () => {
  it('should return 409 if service throws ConflictError', async () => {
    const requestParams = createPlanetRequestFactory();

    (mockPlanetService.create as jest.Mock).mockRejectedValue(new ConflictError('Planet is already registered!'));

    const response = await request(appMock)
      .post('/v1/api/planets')
      .send(requestParams)
      .expect(409);

    expect(response.body).toEqual({
      status: 409,
      message: "ConflictError",
      body: "Planet is already registered!"
    });
    expect(mockPlanetService.create).toHaveBeenCalledTimes(1)
  });

  it('should return 400 if name is empty or null', async () => {
    const requestParams = createPlanetRequestFactory();
    requestParams.name = "";

    const response = await request(appMock)
      .post('/v1/api/planets')
      .send(requestParams)
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      message: "BusinessError",
      body: "Name is required"
    });
    expect(mockPlanetService.create).toHaveBeenCalledTimes(0)
  });

  it('should return 400 if climate is empty or null', async () => {
    const requestParams = createPlanetRequestFactory();
    requestParams.climate = "";

    const response = await request(appMock)
      .post('/v1/api/planets')
      .send(requestParams)
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      message: "BusinessError",
      body: "Climate is required"
    });
    expect(mockPlanetService.create).toHaveBeenCalledTimes(0)
  });

  it('should return 400 if terrain is empty or null', async () => {
    const requestParams = createPlanetRequestFactory();
    requestParams.terrain = "";

    const response = await request(appMock)
      .post('/v1/api/planets')
      .send(requestParams)
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      message: "BusinessError",
      body: "Terrain is required"
    });
    expect(mockPlanetService.create).toHaveBeenCalledTimes(0)
  });

  it('should return 400 if population is negative ', async () => {
    const requestParams = createPlanetRequestFactory();
    requestParams.population = -1;

    const response = await request(appMock)
      .post('/v1/api/planets')
      .send(requestParams)
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      message: "BusinessError",
      body: "Population must be a non-negative integer"
    });
    expect(mockPlanetService.create).toHaveBeenCalledTimes(0)
  });

  it('should create a new planet and return status 201', async () => {
    const requestParams = createPlanetRequestFactory();
    const planet = createPlanetFromDtoFactory(requestParams);

    (mockPlanetService.create as jest.Mock).mockResolvedValue(undefined);

    const response = await request(appMock)
      .post('/v1/api/planets')
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
