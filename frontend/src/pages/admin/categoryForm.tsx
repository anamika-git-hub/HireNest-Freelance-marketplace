import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosConfig from "../../service/axios";
import { useFormik } from "formik";
import { categoryValidationSchema } from "../../components/Schemas/categoryValidationSchema";
import Loader from "../../components/shared/Loader";

const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [apiError, setApiError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      image: null, // New field for image
    },
    validationSchema: categoryValidationSchema,
    onSubmit: async (values) => {
      console.log("Formik values:", values);
      try {
        setApiError(null); // Reset error
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);

        if (values.image) {
          formData.append("image", values.image);
        }

        const response = isEditMode
        ? await axiosConfig.put(`/admin/categories/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await axiosConfig.post("/admin/categories", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
      

        if (response.status === 200 || response.status === 201) {
          alert(`Category ${isEditMode ? "updated" : "created"} successfully!`);
          navigate("/admin/categories");
        }
      } catch (err) {
        console.error(`Error ${isEditMode ? "updating" : "creating"} category`, err);
        setApiError("An error occurred while processing your request.");
      }
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchCategory = async () => {
        try {
          setApiError(null); // Reset error
          const response = await axiosConfig.get(`/admin/categories/${id}`);
          formik.setValues({
            name: response.data.name || "",
            description: response.data.description || "",
            image: null, // Images are not set as a preview URL
          });

          if (response.data.image) {
            setImagePreview(response.data.image); // Set the image preview
          }
        } catch (err) {
          console.error("Error fetching category data", err);
          setApiError("Failed to load category data. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("image", file);

      // Generate a preview of the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
      return <Loader visible={loading} />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">
        {isEditMode ? "Edit Category" : "Create New Category"}
      </h1>

      {apiError && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {apiError}
        </div>
      )}

      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 shadow-md rounded-lg"
        encType="multipart/form-data"
      >
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
          {formik.errors.description && formik.touched.description && (
            <div className="text-red-500 text-sm mt-2">
              {formik.errors.description}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md shadow"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition ${
            formik.isSubmitting && "opacity-50 cursor-not-allowed"
          }`}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting
            ? "Submitting..."
            : isEditMode
            ? "Update Category"
            : "Create Category"}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
