import * as Yup from "yup";

export const categoryValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Category name must be at least 3 characters long.")
    .max(100, "Category name cannot be longer than 100 characters.")
    .required("Category name is required."),
  description: Yup.string()
    .min(5, "Description must be at least 5 characters long.")
    .max(500, "Description cannot be longer than 500 characters.")
    .required("Description is required."),
});
