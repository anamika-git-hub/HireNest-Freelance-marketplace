import { body } from 'express-validator';

export const validateCategoryCreation = [
  body('name')
    .notEmpty().withMessage('Category name is required')
    .isString().withMessage('Category name must be a string')
    .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
    .custom(async (value) => {
      const exists = false; 
      if (exists) {
        throw new Error('Category name already exists');
      }
      return true;
    }),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .isLength({ min: 5, max: 500 }).withMessage('Description must be between 5 and 500 characters'),
  
  body('image')
    .optional()
    .isString().withMessage('Image must be a string URL or path'),
  
  body('state')
    .optional()
    .isIn(['active', 'inactive']).withMessage('State must be either active or inactive')
];