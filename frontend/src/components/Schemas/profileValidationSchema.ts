import * as Yup from 'yup';

export const ClientProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .matches(/^[a-zA-Z]+$/, "First name must only contain letters"),
  
  lastName: Yup.string()
    .required("Last name is required")
    .matches(/^[a-zA-Z]+$/, "Last name must only contain letters"),
  
  phone: Yup.string()
    .matches(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, "Invalid phone number")
    .required("Phone number is required"),
  
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
  
  IDNumber: Yup.string()
    .required("ID number is required")
    .matches(/^\d+$/, "ID number must only contain numbers"),
  
  selectedID: Yup.string()
    .oneOf(['debit_card', 'passport', 'driver_license', 'national_id'], "Invalid ID Type")
    .required("ID type selection is required"),

    imagePreview: Yup.string()
    .required("Profile image is required")
    .test(
      "valid-image",
      "Please upload a valid image",
      (value) => !!value?.startsWith('data:image/') // Ensure it's either valid or false
    ),

  imageFront: Yup.string()
    .required("Upload front image for ID verification")
    .test(
      "valid-image-front",
      "Please upload a valid image",
      (value) => !!value?.startsWith('data:image/') // Same check as above
    ),

  imageBack: Yup.string()
    .required("Upload back image for ID verification")
    .test(
      "valid-image-back",
      "Please upload a valid image",
      (value) => !!value?.startsWith('data:image/') // Same check as above
    ),
});
