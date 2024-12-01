import React from "react";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../../service/axios";
import { useFormik } from "formik";
import { categoryValidationSchema } from "../../components/Schemas/categoryValidationSchema";

const CreateCategory: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: categoryValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosConfig.post("/admin/categories", values);
        if (response.status === 201) {
          setTimeout(() => {
            navigate("/admin/categories");
          }, 1500);
        }
      } catch (err) {
        console.error("Error creating category", err);
      }
    },
  });

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Create New Category</h1>

      <form onSubmit={formik.handleSubmit} className="bg-white p-6 shadow-md rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category Name</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Display error message below the name input */}
          {formik.errors.name && formik.touched.name && (
            <div className="text-red-500 text-sm mt-2">{formik.errors.name}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          {/* Display error message below the description input */}
          {formik.errors.description && formik.touched.description && (
            <div className="text-red-500 text-sm mt-2">{formik.errors.description}</div>
          )}
        </div>

        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Create Category
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
