import { body } from 'express-validator';

export const validateRequestUpdate = [
    body('fullName')
      .optional()
      .isString().withMessage('Full Name must be a string')
      .matches(/^[A-Za-z\s]+$/).withMessage('Name should only contain letters and spaces')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
      .optional()
      .isEmail().withMessage('Invalid email address')
      .normalizeEmail(),
    
    body('description')
      .optional()
      .isString().withMessage('Description must be a string')
      .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
    
    body('status')
      .optional()
      .isIn(['pending', 'accepted', 'rejected']).withMessage('Invalid status value')
  ];