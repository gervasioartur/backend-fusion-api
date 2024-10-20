import { response } from '@/v1/api/dtos';

const paths = {
  '/planets': {
    post: {
      summary: 'Create a new planet',
      tags: ['Planets'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/createPlanetRequest',
            },
          },
        },
      },
      responses: {
        '201': { description: 'Planet created successfully' },
        '400': { description: 'Invalid input' },
        '409': { description: 'Planet already registered' },
        '500': { description: 'Server error' },
      },
    },
    get: {
      summary: 'Get a list of all planets',
      tags: ['Planets'],
      responses: {
        '200': {
          description: 'List of planets returned successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Planet',
                },
              },
            },
          },
        },
        '500': { description: 'Server error' },
      },
    },
  },
  '/planets/{id}': {
    get: {
      summary: 'Get a planet by its ID',
      tags: ['Planets'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'The ID of the planet to retrieve',
        },
      ],
      responses: {
        '200': {
          description: 'Planet returned successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Planet',
              },
            },
          },
        },
        '404': { description: 'Planet not found' },
        '500': { description: 'Server error' },
      },
    },
    put: {
      summary: 'Update planet',
      tags: ['Planets'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'The ID of the planet to retrieve',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/updatePlanetRequest',
            },
          },
        },
      },
      responses: {
        '200': { description: 'Planet updated successfully' },
        '404': { description: 'Planet not found' },
        '409': { description: 'Planet name already taken' },
        '500': { description: 'Server error' },
      },
    },
    delete: {
      summary: 'Delete planet',
      tags: ['Planets'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'The ID of the planet to retrieve',
        },
      ],
      responses: {
        '200': { description: 'Planet deleted successfully' },
        '404': { description: 'Planet not found' },
        '500': { description: 'Server error' },
      },
    },
  },
};

const components = {
  schemas: {
    response: {
      type: 'object',
      properties: {
        status: { type: 'number' },
        message: { type: 'string' },
        body: { type: 'string' },
      },
      required: ['name', 'climate', 'terrain'],
    },
    createPlanetRequest: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The name of the planet' },
        climate: { type: 'string', description: 'The climate of the planet' },
        terrain: { type: 'string', description: 'The terrain of the planet' },
        population: { type: 'number', description: 'The population of the planet' },
      },
      required: ['name', 'climate', 'terrain'],
    },
    updatePlanetRequest: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The name of the planet' },
        climate: { type: 'string', description: 'The climate of the planet' },
        terrain: { type: 'string', description: 'The terrain of the planet' },
        population: { type: 'number', description: 'The population of the planet' },
      },
      required: ['name', 'climate', 'terrain'],
    },
    Planet: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Unique identifier for the planet' },
        name: { type: 'string', description: 'The name of the planet' },
        climate: { type: 'string', description: 'The climate of the planet' },
        terrain: { type: 'string', description: 'The terrain of the planet' },
        population: { type: 'number', description: 'The population of the planet' },
        active: { type: 'boolean', description: 'Indicates if the planet is active' },
      },
      required: ['id', 'name', 'climate', 'terrain'],
    },
  },
};

export { paths, components };
