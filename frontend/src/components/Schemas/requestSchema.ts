import * as Yup from 'yup';

export const RequestSchema = Yup.object().shape({
    fullName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Name should only contain letters and spaces')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters')
      .required('Full Name is required'),
    
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be at most 500 characters')
      .required('Project description is required')
  });