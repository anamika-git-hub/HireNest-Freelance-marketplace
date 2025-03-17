import { body, validationResult } from 'express-validator';

export const validateContract = [
  body('taskId')
    .notEmpty().withMessage('Task ID is required')
    .isMongoId().withMessage('Invalid task ID format'),
  
  body('bidId')
    .notEmpty().withMessage('Bid ID is required')
    .isMongoId().withMessage('Invalid bid ID format'),
  
  body('clientId')
    .notEmpty().withMessage('Client ID is required')
    .isMongoId().withMessage('Invalid client ID format'),
  
  body('freelancerId')
    .notEmpty().withMessage('Freelancer ID is required')
    .isMongoId().withMessage('Invalid freelancer ID format'),
  
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),
  
  body('budget')
    .notEmpty().withMessage('Budget is required')
    .isNumeric().withMessage('Budget must be a number')
    .custom(value => {
      if (Number(value) <= 0) {
        throw new Error('Budget must be positive');
      }
      return true;
    }),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string'),
  
  body('milestones')
    .isArray({ min: 1 }).withMessage('At least one milestone is required'),
  
  body('milestones.*.title')
    .notEmpty().withMessage('Milestone title is required')
    .isString().withMessage('Milestone title must be a string'),
  
  body('milestones.*.description')
    .optional()
    .isString().withMessage('Milestone description must be a string'),
  
  body('milestones.*.dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date format')
    .toDate(),
  
  body('milestones.*.cost')
    .notEmpty().withMessage('Milestone cost is required')
    .isNumeric().withMessage('Milestone cost must be a number')
    .custom(value => {
      if (Number(value) <= 0) {
        throw new Error('Milestone cost must be positive');
      }
      return true;
    }),
  
  // Custom validator to ensure total milestone costs match the budget
  body().custom((value) => {
    if (!value.milestones || !value.budget) {
      return true; // Skip validation if no milestones or budget
    }
    
    const totalMilestoneCost = value.milestones.reduce(
      (acc: number, curr: any) => acc + Number(curr.cost || 0),
      0
    );
    
    if (totalMilestoneCost !== Number(value.budget)) {
      throw new Error('Total milestone cost must exactly match the project budget');
    }
    
    return true;
  })
];