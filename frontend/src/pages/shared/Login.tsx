import React from "react";
import { useFormik } from "formik";
import axiosConfig from "../../service/axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../store/userSlice";
import { loginValidationSchema } from "../../components/Schemas/signInValidationSchema";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const googleSubmit  = async(googleData:any)=>{
    const decodeResponse:any= jwtDecode(googleData.credential)
    console.log(decodeResponse)
     const {email} = decodeResponse
     const user = {email}
     try {
      const response = await axiosConfig.post(
        "/users/google-signup",
        user
      );
  
      if(response.data.token){
        const user = response.data.user;
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("email", response.data.user.email);
  
        dispatch(loginUser(user));
        toast.success("User logged in successfully");
        navigate("/account-setup");
      }
     } catch (error) {
      toast.error('There was an error during signUp')
     }
   }

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
          const userDetail = response.data.userDetails
          console.log('refreshtoken',response.data.refreshToken)

          localStorage.setItem("accessToken", response.data.token);
          localStorage.setItem("refreshToken",response.data.refreshToken);
          localStorage.setItem("role", response.data.user.role);
          localStorage.setItem("email", response.data.user.email);
          localStorage.setItem('userId',response.data.user._id);

          dispatch(loginUser({user,userDetail}));

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
    <div className="bg-cover bg-gradient-to-r from-blue-100 to-white bg-center h-screen flex items-center justify-center">
      <div className="flex items-stretch max-w-4xl w-full bg-white  rounded-lg shadow-lg mt-16">
        
        {/* Form Div */}
        <div className=" w-1/2 p-8 flex flex-col" style={{flexGrow: 1}}>
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Login</h2>
          <p className="text-sm text-blue-600 text-center mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-blue-600 text-sm font-semibold mb-2">Email</label>
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
              <label className="block text-blue-600 text-sm font-semibold mb-2">Password</label>
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
          <Link to={'/forgot-password'} className="text-start my-4 text-blue-700">
            Forgot password?
          </Link>
          <div className="text-center my-4 text-blue-600">or</div>
          {/* Google Login Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={googleSubmit}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        </div>
  
        {/* Image Div */}
        <div className="mx- w-1/2 flex items-center justify-center" style={{flexGrow: 1}}>
          <img
            src="/assets/login.png"
            alt="Your Image"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
