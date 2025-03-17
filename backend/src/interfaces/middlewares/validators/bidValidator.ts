
import { body } from 'express-validator';

export const getBidValidationRules = (minRate: number, maxRate: number) => [
  body('rate')
    .notEmpty().withMessage('Rate is required')
    .isNumeric().withMessage('Rate must be a number')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Rate must be a positive number');
      }
      if (value < minRate || value > maxRate) {
        throw new Error(`Rate should be between ${minRate} and ${maxRate}`);
      }
      return true;
    }),
  body('deliveryTime')
    .notEmpty().withMessage('Delivery time is required')
    .isInt({ min: 1, max: 365 }).withMessage('Delivery time must be between 1 and 365'),
  body('timeUnit')
    .notEmpty().withMessage('Time unit is required')
    .isIn(['Days', 'Weeks']).withMessage('Time unit must be either Days or Weeks')
];