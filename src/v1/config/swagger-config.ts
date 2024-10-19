import { createPlanetRequest } from '@/v1/api/dtos';

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
              type: 'object',
              properties: {
                name: { type: 'string' },
                climate: { type: 'string' },
                terrain: { type: 'string' },
                population: { type: 'number' },
              },
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
  },
};

const components = {
  schemas: {
    createPlanetRequest: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        climate: { type: 'string' },
        terrain: { type: 'string' },
        population: { type: 'number' },
      },
      required: ['name', 'climate', 'terrain'],
    },
  },
};

export { paths, components };
