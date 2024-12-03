import React from "react";
import { useFormik } from "formik";
import axiosConfig from "../../service/axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../store/userSlice";
import { loginValidationSchema } from "../../components/Schemas/signInValidationSchema";
import toast from "react-hot-toast";

const Login: React.FC = () => {
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
        const response = await axiosConfig.post("users/login", values);
        if (response.status === 200) {
          const user = response.data.user;

          localStorage.setItem("accessToken", response.data.token);
          localStorage.setItem("role", response.data.user.role);
          localStorage.setItem("email", response.data.user.email);

          dispatch(loginUser(user));
          toast.success("User logged in successfully");
          navigate("/");
        }
      } catch (error: any) {
        console.log("Login failed:", error);
        if(error.response) {
          const errorMessage = error.response.data.error || 'An error occurred';
          toast.error(errorMessage);
        }
        
      }
    },
  });

  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/team-coworkers-comparing-source-codes-running-laptop-screen-computer-monitor-it-development-office-software-developers-collaborating-data-coding-group-project-while-sitting-desk_482257-41846.jpg?t=st=1732350387~exp=1732353987~hmac=010e9fb6cd61dded2e322b967e756c848e0e6655f446d7b02c6be14fa9f36790&w=1060')",
      }}
    >
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Login</h2>
        <p className="text-sm text-white text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {formik.errors.email && formik.touched.email && (
              <div className="text-red-500 text-sm mt-2">{formik.errors.email}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {formik.errors.password && formik.touched.password && (
              <div className="text-red-500 text-sm mt-2">{formik.errors.password}</div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <div className="text-center my-4 text-white">or</div>
        <div className="flex justify-between">
          <button className="w-1/2 bg-blue-50 text-blue-700 border border-blue-500 py-2 rounded-md mr-2">
            <i className="fab fa-facebook"></i> Log In via Facebook
          </button>
          <button className="w-1/2 bg-red-50 text-red-700 border border-red-500 py-2 rounded-md ml-2">
            <i className="fab fa-google"></i> Log In via Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
