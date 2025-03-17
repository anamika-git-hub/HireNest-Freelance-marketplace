import { body } from 'express-validator';

export const validateFreelancerProfile = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('location')
    .notEmpty().withMessage('Location is required')
    .isString().withMessage('Location must be a string'),
  
  body('tagline')
    .notEmpty().withMessage('Tagline is required')
    .isString().withMessage('Tagline must be a string')
    .isLength({ min: 10, max: 100 }).withMessage('Tagline must be between 10 and 100 characters'),
  
  body('experience')
    .notEmpty().withMessage('Experience is required')
    .isString().withMessage('Experience must be a string'),
  
  body('hourlyRate')
    .notEmpty().withMessage('Hourly rate is required')
    .isNumeric().withMessage('Hourly rate must be a number')
    .custom(value => {
      if (value < 10 || value > 100) {
        throw new Error('Hourly rate must be between $10 and $100');
      }
      return true;
    }),
  
  body('skills')
    .isArray({ min: 1 }).withMessage('At least one skill is required')
    .custom(skills => {
      if (!skills.every((skill: string) => typeof skill === 'string')) {
        throw new Error('All skills must be strings');
      }
      return true;
    }),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  
  body('profileImage')
    .optional()
    .isString().withMessage('Profile image must be a string (URL or path)'),
  
  body('userId')
    .optional()
    .isMongoId().withMessage('User ID must be a valid MongoDB ObjectId'),
  
  body('attachments')
    .optional()
    .isArray().withMessage('Attachments must be an array'),
  
  body('attachments.*.file')
    .if(body('attachments').exists())
    .optional()
    .isString().withMessage('Attachment file must be a string (URL or path)'),
  
  body('attachments.*.title')
    .if(body('attachments').exists())
    .optional()
    .isString().withMessage('Attachment title must be a string'),
  
  body('attachments.*.description')
    .if(body('attachments').exists())
    .optional()
    .isString().withMessage('Attachment description must be a string')
];