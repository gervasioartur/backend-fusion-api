import { body } from 'express-validator';
import { updatePlanetRequest } from '@/v1/api/dtos';

export const createPlanetValidator = [
  body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
  body('climate').isString().withMessage('Climate must be a string').notEmpty().withMessage('Climate is required'),
  body('terrain').isString().withMessage('Terrain must be a string').notEmpty().withMessage('Terrain is required'),
  body('population').optional().isInt({ min: 0 }).withMessage('Population must be a non-negative integer'),
];

export const updatePlanetValidator = ({name, climate, terrain, population}: updatePlanetRequest): string | null => {
  if (name === "") return 'Name is required'
  if (climate === "") return 'Climate is required'
  return null
}