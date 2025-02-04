// src/components/Schemas/bidValidationSchema.ts

import * as Yup from 'yup';

interface IBidRateContext {
  minRate: number;
  maxRate: number;
}

export const BidValidationSchema = (rateContext: IBidRateContext) => {
  return Yup.object().shape({
    rate: Yup.number()
      .required('Rate is required')
      .positive('Rate must be a positive number')
      .min(
        rateContext.minRate,
        `Rate should be within the task budget`
      )
      .max(
        rateContext.maxRate,
        `Rate should be within the task budget`
      ),
    deliveryTime: Yup.number()
      .required('Delivery time is required')
      .positive('Delivery time must be a positive number')
      .integer('Delivery time must be a whole number')
      .max(365, 'Delivery time cannot exceed 1 year'),
    timeUnit: Yup.string()
      .required('Time unit is required')
      .oneOf(['Days', 'Weeks'], 'Invalid time unit')
  });
};