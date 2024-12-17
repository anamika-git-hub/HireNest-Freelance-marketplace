import * as Yup from "yup";

export  const AccountSetupValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string()
    .matches(
      /^[0-9]{10}$/,
      "Phone number must be exactly 10 digits and contain only numbers"
    )
    .required("Phone number is required"),
  dob: Yup.string().required("Date of birth is required"),
  selectedID: Yup.string().required("ID type is required"),
  IDNumber: Yup.string().required("ID number is required"),
});
