import { body } from 'express-validator';

export const validateTaskUpdate = [
    body('projectName')
      .optional()
      .isString().withMessage('Project Name must be a string')
      .isLength({ min: 3 }).withMessage('Project Name must be at least 3 characters'),
    
    body('category')
      .optional()
      .isString().withMessage('Category must be a string'),
    
    body('timeline')
      .optional()
      .isISO8601().withMessage('Timeline must be a valid date')
      .custom((value) => {
        const date = new Date(value);
        const today = new Date();
        if (date < today) {
          throw new Error('Timeline cannot be in the past');
        }
        return true;
      }),
    
    body('skills')
      .optional()
      .isArray({ min: 1 }).withMessage('At least one skill is required')
      .custom(skills => {
        if (!skills.every((skill:string) => typeof skill === 'string')) {
          throw new Error('All skills must be strings');
        }
        return true;
      }),
    
    body('rateType')
      .optional()
      .isIn(['hourly', 'fixed']).withMessage('Rate type must be either hourly or fixed'),
    
    body('minRate')
      .optional()
      .isNumeric().withMessage('Minimum rate must be a number')
      .custom(value => {
        if (value <= 0) {
          throw new Error('Minimum rate must be positive');
        }
        return true;
      })
      .toFloat(),
    
    body('maxRate')
      .optional()
      .isNumeric().withMessage('Maximum rate must be a number')
      .custom(value => {
        if (value <= 0) {
          throw new Error('Maximum rate must be positive');
        }
        return true;
      })
      .toFloat()
      .custom((value, { req }) => {
        if (req.body.minRate && value <= req.body.minRate) {
          throw new Error('Maximum rate must be greater than Minimum rate');
        }
        return true;
      }),
    
    body('description')
      .optional()
      .isString().withMessage('Description must be a string')
      .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    
    body('attachments')
      .optional()
      .custom((value, { req }) => {
        if (typeof value === 'string') {
          return true; 
        } else if (Array.isArray(value)) {
          return true; 
        }
        return true;
      }),
    
    body('status')
      .optional()
      .isIn(['pending', 'onhold', 'ongoing', 'completed']).withMessage('Invalid status value')
  ];