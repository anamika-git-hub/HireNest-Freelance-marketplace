import { body } from 'express-validator';

export const validateTaskSubmission = [
  body('projectName')
    .notEmpty().withMessage('Project Name is required')
    .isString().withMessage('Project Name must be a string')
    .isLength({ min: 3 }).withMessage('Project Name must be at least 3 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isString().withMessage('Category must be a string'),
  
  body('timeline')
    .notEmpty().withMessage('Timeline is required')
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
    .isArray({ min: 1 }).withMessage('At least one skill is required')
    .custom(skills => {
      if (!skills.every((skill:string) => typeof skill === 'string')) {
        throw new Error('All skills must be strings');
      }
      return true;
    }),
  
  body('rateType')
    .notEmpty().withMessage('Rate type is required')
    .isIn(['hourly', 'fixed']).withMessage('Rate type must be either hourly or fixed'),
  
  body('minRate')
    .notEmpty().withMessage('Minimum rate is required')
    .isNumeric().withMessage('Minimum rate must be a number')
    .custom(value => {
      if (value <= 0) {
        throw new Error('Minimum rate must be positive');
      }
      return true;
    })
    .toFloat(),
  
  body('maxRate')
    .notEmpty().withMessage('Maximum rate is required')
    .isNumeric().withMessage('Maximum rate must be a number')
    .custom(value => {
      if (value <= 0) {
        throw new Error('Maximum rate must be positive');
      }
      return true;
    })
    .toFloat()
    .custom((value, { req }) => {
      if (value <= req.body.minRate) {
        throw new Error('Maximum rate must be greater than Minimum rate');
      }
      return true;
    }),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('clientId')
    .notEmpty().withMessage('Client ID is required')
    .isMongoId().withMessage('Client ID must be a valid MongoDB ObjectId'),
    
  body('attachments')
    .optional()
    .isArray().withMessage('Attachments must be an array'),
  
  body('status')
    .optional()
    .isIn(['pending', 'onhold', 'ongoing', 'completed']).withMessage('Invalid status value')
];