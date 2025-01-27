import * as Yup from 'yup';

export const FreelancerProfileValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Name is required'),
    location: Yup.string()
      .required('Location is required'),
    tagline: Yup.string()
      .min(10, 'Tagline must be at least 10 characters')
      .max(100, 'Tagline must be less than 100 characters')
      .required('Tagline is required'),
    experience: Yup.string()
      .required('Experience is required'),
    hourlyRate: Yup.number()
      .min(10, 'Minimum hourly rate is $10')
      .max(100, 'Maximum hourly rate is $100')
      .required('Hourly rate is required'),
    description: Yup.string()
      .min(50, 'Description must be at least 50 characters')
      .required('Description is required'),
  });