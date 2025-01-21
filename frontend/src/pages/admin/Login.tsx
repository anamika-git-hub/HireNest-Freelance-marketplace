import React from "react";
import { useFormik } from "formik";
import axiosConfig from "../../service/axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginValidationSchema } from "../../components/Schemas/signInValidationSchema";

const AdminLogin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema, 
    onSubmit: async (values) => {
      try {
        const response = await axiosConfig.post("admin/login", values);
        if (response.status === 200) {
          // const  userData = {user:response.data.admin}
          dispatch(loginUser(response.data.admin));
          navigate('/admin/dashboard');
          toast.success('Admin logged in successfully');
          localStorage.setItem('accessToken', response.data.token);
          localStorage.setItem('role', response.data.admin.role);
          localStorage.setItem('email', response.data.admin.email);
        }
      } catch (error: any) {
        if (error.response) {
          const errorMessage = error.response.data.error || 'An error occurred during login';
          toast.error(errorMessage);
        }
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg flex flex-col md:flex-row w-full max-w-4xl">
        <div className="flex-1 bg-gray-800 text-white flex flex-col justify-center items-center p-6 rounded-l-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">HireNest</h1>
            <p className="text-lg">Admin Dashboard</p>
          </div>
        </div>

        <div className="flex-1 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Welcome
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Please login to the admin dashboard.
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-red-500 text-sm mt-2">{formik.errors.email}</div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your password"
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              {formik.errors.password && formik.touched.password && (
                <div className="text-red-500 text-sm mt-2">{formik.errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Forgot Password?{" "}
              <a href="#" className="text-gray-800 hover:underline">
                Reset here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
