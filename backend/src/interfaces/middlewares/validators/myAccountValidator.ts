import { body } from 'express-validator';

export const validateAccountUpdate = [
  body('firstName')
    .optional()
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string'),
  
  body('lastName')
    .optional()
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/).withMessage('Phone number must be exactly 10 digits and contain only numbers'),
  
  body('dob')
    .optional()
    .notEmpty().withMessage('Date of birth is required'),
  
  body('currentPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('newPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords must match');
      }
      return true;
    })
];