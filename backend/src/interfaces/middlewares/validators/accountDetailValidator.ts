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
    .custom((value, { req }) => {
      if (!req.files || !req.files.profileImage) {
        throw new Error('Profile image is required');
      }
      return true;
    }),
  
  body('idFrontImage')
    .custom((value, { req }) => {
      if (!req.files || !req.files.idFrontImage) {
        throw new Error('ID front image is required');
      }
      return true;
    }),
  
  body('idBackImage')
    .custom((value, { req }) => {
      if (!req.files || !req.files.idBackImage) {
        throw new Error('ID back image is required');
      }
      return true;
    }),
  
  body('userId')
    .optional()
    .isMongoId().withMessage('User ID must be a valid MongoDB ObjectId')
];