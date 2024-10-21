import swaggerJSDoc from 'swagger-jsdoc';
import {paths,components} from './swagger-config';
import * as dotenv from "dotenv";


dotenv.config();

export const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Fusion Api',
      version: 'v1',
      description: 'API documentation for Backend Fusion Api',
    },
    paths,
    components
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
