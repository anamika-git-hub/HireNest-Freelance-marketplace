import {body} from 'express-validator';

export const validateSignUp = [
    body('email')
      .isEmail().withMessage('Please enter a valid email')
      .normalizeEmail(),
    
    body('password')
      .if((value, { req }) => !req.body.googleSignUp)
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      .matches(/\d/).withMessage('Password must contain at least one number'),
    
    body('role')
      .optional()
      .isIn(['client', 'freelancer', 'admin']).withMessage('Invalid role'),
  
    body('googleSignUp')
      .optional()
      .isBoolean().withMessage('googleSignUp must be boolean')
  ];
