import { body } from 'express-validator';

export const createPlanetValidator = [
  body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
  body('climate').isString().withMessage('Climate must be a string').notEmpty().withMessage('Climate is required'),
  body('terrain').isString().withMessage('Terrain must be a string').notEmpty().withMessage('Terrain is required'),
  body('population').optional().isInt({ min: 0 }).withMessage('Population must be a non-negative integer'),
];