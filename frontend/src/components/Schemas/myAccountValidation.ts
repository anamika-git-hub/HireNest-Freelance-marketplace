import * as Yup from "yup";

export const MyAccountValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string()
    .matches(
      /^[0-9]{10}$/,
      "Phone number must be exactly 10 digits and contain only numbers"
    )
    .required("Phone number is required"),
  dob: Yup.string().required("Date of birth is required"),
  currentPassword: Yup.string()
    .min(6, "Password must be at least 6 characters"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .test(
      'conditional-required',
      'New password is required when changing password',
      function(value) {
        const { currentPassword } = this.parent;
        if (currentPassword && !value) {
          return false;
        }
        return true;
      }
    ),
  confirmPassword: Yup.string()
  .oneOf([Yup.ref("newPassword")], "Passwords must match")
  .test(
    'conditional-required',
    "Confirm password is required when changing password",
    function(value) {
      const {newPassword} = this.parent;
      if(newPassword && !value) {
        return false;
      }
      return true;
    }
  )
    
});