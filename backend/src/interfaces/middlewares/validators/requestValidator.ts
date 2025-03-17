import { body } from 'express-validator';

export const validateRequestSubmission = [
  body('fullName')
    .notEmpty().withMessage('Full Name is required')
    .isString().withMessage('Full Name must be a string')
    .matches(/^[A-Za-z\s]+$/).withMessage('Name should only contain letters and spaces')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  
  body('description')
    .notEmpty().withMessage('Project description is required')
    .isString().withMessage('Description must be a string')
    .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  
  body('freelancerId')
    .notEmpty().withMessage('Freelancer ID is required')
    .isMongoId().withMessage('Freelancer ID must be a valid MongoDB ObjectId'),
  
  body('requesterId')
    .notEmpty().withMessage('Requester ID is required')
    .isMongoId().withMessage('Requester ID must be a valid MongoDB ObjectId'),
  
  body('status')
    .optional()
    .isIn(['pending', 'accepted', 'rejected']).withMessage('Invalid status value')
];