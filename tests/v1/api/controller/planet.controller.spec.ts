import request from 'supertest';
import {
  createPlanetFromDtoFactory,
  createPlanetRequestFactory,
  planetsWithIdFactory,
} from '@/tests/v1/mocks/planet-mocks';
import { ConflictError, UnexpectedError } from '@/v1/domain/errors';
import { mockPlanetService } from '@/tests/v1/mocks/routes-mock';
import appMock from '@/tests/v1/mocks/app-mock';

describe('PlanetController', () => {
 describe('create planet', () => {
   it('Should return 500 if service throws UnexpectError on create planet', async () => {
     const requestParams = createPlanetRequestFactory();
     const planet = createPlanetFromDtoFactory(requestParams);

     (mockPlanetService.create as jest.Mock).mockRejectedValue(new UnexpectedError('An unexpected error occurred while trying save planet info.'));

     const response = await request(appMock)
       .post('/v1/api/planets')
       .send(requestParams)
       .expect(500);

     expect(response.body).toEqual({
       status: 500,
       message: "UnexpectedError",
       body: "An unexpected error occurred while trying save planet info."
     });

     expect(mockPlanetService.create).toHaveBeenCalledWith(planet);
     expect(mockPlanetService.create).toHaveBeenCalledTimes(1)
   })

   it('should return 409 if service throws ConflictError on create planet', async () => {
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

   it('should return 400 if name is empty or null on create planet', async () => {
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

   it('should return 400 if climate is empty or null on create planet', async () => {
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

   it('should return 400 if terrain is empty or null on create planet', async () => {
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

   it('should return 400 if population is negative on create planet', async () => {
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

   it('should create a new planet and return status 201 on create planet', async () => {
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
 })

  describe('read all planets', () => {
    it('Should return 500 if service throws UnexpectError on read all planets', async () => {
      (mockPlanetService.readAll as jest.Mock).mockRejectedValue(new UnexpectedError('An unexpected error occurred while trying save planet info.'));

      const response = await request(appMock)
        .get('/v1/api/planets')
        .send()
        .expect(500);

      expect(response.body).toEqual({
        status: 500,
        message: "UnexpectedError",
        body: "An unexpected error occurred while trying save planet info."
      });

      expect(mockPlanetService.readAll).toHaveBeenCalledTimes(1)
    })

    it('Should return 200 if service return list of planets on read all planets', async () => {
     const planets = planetsWithIdFactory();

     (mockPlanetService.readAll as jest.Mock).mockResolvedValue(planets);

      const response = await request(appMock)
        .get('/v1/api/planets')
        .send()
        .expect(200);

      expect(response.body).toEqual({
        status: 200,
        message: "OK",
        body: planets
      });

      expect(mockPlanetService.readAll).toHaveBeenCalledTimes(1)
    });
  })
});

