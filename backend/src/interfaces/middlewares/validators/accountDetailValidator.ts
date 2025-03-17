import { body } from 'express-validator';

export const validateAccountDetail = [
  body('firstname')
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string'),
  
  body('lastname')
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string'),
  
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/).withMessage('Phone number must be exactly 10 digits and contain only numbers'),
  
  body('dateOfBirth')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Date of birth must be a valid date')
    .toDate(),
  
  body('idType')
    .notEmpty().withMessage('ID type is required')
    .isString().withMessage('ID type must be a string'),
  
  body('idNumber')
    .notEmpty().withMessage('ID number is required')
    .isString().withMessage('ID number must be a string'),
  
  body('profileImage')
    .notEmpty().withMessage('Profile image is required')
    .isString().withMessage('Profile image must be a string (URL or path)'),
  
  body('idFrontImage')
    .notEmpty().withMessage('ID front image is required')
    .isString().withMessage('ID front image must be a string (URL or path)'),
  
  body('idBackImage')
    .notEmpty().withMessage('ID back image is required')
    .isString().withMessage('ID back image must be a string (URL or path)'),
  
  body('userId')
    .optional()
    .isMongoId().withMessage('User ID must be a valid MongoDB ObjectId')
];