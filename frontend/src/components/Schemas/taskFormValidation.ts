import * as Yup from "yup";

export const TaskFormValidation = Yup.object({
    projectName: Yup.string()
      .required("Project Name is required")
      .min(3, "Project Name must be at least 3 characters"),
    category: Yup.string().required("Category is required"),
    timeline: Yup.date()
      .required("Timeline is required")
      .min(new Date(), "Timeline cannot be in the past"),
    minRate: Yup.number()
      .required("Minimum rate is required")
      .positive("Minimum rate must be positive"),
    maxRate: Yup.number()
      .required("Maximum rate is required")
      .positive("Maximum rate must be positive")
      .moreThan(Yup.ref("minRate"), "Maximum rate must be greater than Minimum rate"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
  });