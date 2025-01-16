import React, { useState, useRef, useDebugValue } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccountData } from "../../store/accountSlice";
import axiosConfig from "../../service/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AccountSetupValidationSchema } from "../../components/Schemas/accountSetupValidation";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useLocation } from "react-router-dom";

const AccountSetup: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFrontFile, setImageFrontFile] = useState<File | null>(null);
  const [imageFrontPreview, setImageFrontPreview] = useState<string | null>(
    null
  );
  const [imageBackFile, setImageBackFile] = useState<File | null>(null);
  const [imageBackPreview, setImageBackPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { role } = location.state || {}; 
 

  const currentUserId = useSelector((state: RootState) => state.user.userId);
  const currentRole = useSelector((state:RootState)=> state.user.userRole);
  
 
  

  const initialValues = {
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    selectedID: "debit_card",
    IDNumber: "",
  };



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImagePreview(fileURL);
      setImageFile(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleIdImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          if (side === "front") {
            setImageFrontPreview(reader.result);
            setImageFrontFile(file);
          } else if (side === "back") {
            setImageBackPreview(reader.result);
            setImageBackFile(file);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (values: typeof initialValues) => {
    const formData = new FormData();
    formData.append("firstname", values.firstName);
    formData.append("lastname", values.lastName);
    formData.append("phone", values.phone);
    formData.append("dateOfBirth", values.dob);
    formData.append("idType", values.selectedID);
    formData.append("idNumber", values.IDNumber);
    formData.append('userId',currentUserId || '')

    if (imageFile) formData.append("profileImage", imageFile);
    if (imageFrontFile) formData.append("idFrontImage", imageFrontFile);
    if (imageBackFile) formData.append("idBackImage", imageBackFile);

    

    try {
      const response = await axiosConfig.post("/users/setup-account",formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (response.status === 201) {
        alert("Profile setup completed successfully!");
        const formDataToStore = {

          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          dob: values.dob,
          selectedID: values.selectedID,
          IDNumber: values.IDNumber,
          profileImage: imagePreview,
          idFrontImage: imageFrontPreview,
          idBackImage: imageBackPreview,
        };
        dispatch(setAccountData(formDataToStore));
        
        if (role === "freelancer") {
          navigate("/freelancer/freelancer-profile"); 
      } else if (role === "client") {
          navigate("/login");
      }
      }
    } catch (error) {
      console.error("Failed to submit form data:", error);
      alert("There was an error submitting your profile.");
    }
  };

  return (
    <section
      id="hero"
      className="hero section pt-20 pb-16 bg-gradient-to-r from-blue-100 to-white w-full overflow-hidden"
    >
      <div className="container mx-20 px-6">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-center mx-auto mb-4 mt-6 w-full">
          Set Up your Account <br />
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Fill in your personal details and upload required documents to get
          started.
        </p>
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2">
          <Formik
              initialValues={initialValues}
              validationSchema={AccountSetupValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form className="w-full max-w-3xl space-y-8">
                  <div className="flex gap-8 items-start mb-6">
                    <div className="relative w-32 h-32 bg-gray-500 rounded-md my-7 flex justify-center items-center overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-gray-300">
                          Upload Photo
                        </span>
                      )}
                      <div
                        className="absolute bottom-0 right-0 bg-blue-700 hover:bg-blue-600 p-2 rounded-full cursor-pointer"
                        onClick={handleEditClick}
                      >
                        <FaEdit className="text-white text-sm" />
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <div className="col-span-2 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            First Name
                          </label>
                          <Field
                            type="text"
                            name="firstName"
                            className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Tom"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Last Name
                          </label>
                          <Field
                            type="text"
                            name="lastName"
                            className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Smith"
                          />
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Phone
                          </label>
                          <Field
                            type="tel"
                            name="phone"
                            className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="(123) 456-7890"
                          />
                          <ErrorMessage
                            name="phone"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <Field
                            type="date"
                            name="dob"
                            className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <ErrorMessage
                            name="dob"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold mt-6 text-gray-700">
                    ID Verification
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Select ID Type
                      </label>
                      <Field
                        as="select"
                        name="selectedID"
                        className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="debit_card">💳 Debit/Credit Card</option>
                        <option value="passport">🌍 Passport</option>
                        <option value="driver_license">
                          🚗 Driver's License
                        </option>
                        <option value="national_id">🆔 National ID</option>
                      </Field>
                      <ErrorMessage
                        name="selectedID"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        ID Number
                      </label>
                      <Field
                        type="text"
                        name="IDNumber"
                        className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="XXXX XXXX XXXX XXXX"
                      />
                      <ErrorMessage
                        name="IDNumber"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="id-front-upload"
                    className="block text-sm text-gray-700 mb-2"
                  >
                    Upload ID Front
                  </label>
                  <label
                    htmlFor="id-front-upload"
                    className="cursor-pointer px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-semibold"
                  >
                    Upload Front
                  </label>
                  <input
                    type="file"
                    id="id-front-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleIdImageUpload(e, "front")}
                  />
                  {imageFrontPreview && (
                    <img
                      src={imageFrontPreview}
                      alt="ID Front Preview"
                      className="mt-2 rounded-md border w-32 h-20 object-cover"
                    />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="id-back-upload"
                    className="block text-sm text-gray-700 mb-2"
                  >
                    Upload ID Back
                  </label>
                  <label
                    htmlFor="id-back-upload"
                    className="cursor-pointer px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-semibold"
                  >
                    Upload Back
                  </label>
                  <input
                    type="file"
                    id="id-back-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleIdImageUpload(e, "back")}
                  />
                  {imageBackPreview && (
                    <img
                      src={imageBackPreview}
                      alt="ID Back Preview"
                      className="mt-2 rounded-md border w-32 h-20 object-cover"
                    />
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-6 p-3 rounded-lg text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              >
                Submit
              </button>
                </Form>
              )}
            </Formik>
            
          
        </div>
        {/* Right Image */}
      <div className="lg:w-1/2 mt-10 lg:mt-0 mb-40">
            <div className="text-center">
              <img
                src="/assets/account-setupImage.png"
                alt="Hero Illustration"
                className="w-full max-w-md mx-auto lg:max-w-lg"
              />
            </div>
          </div>
      </div>
      
      </div>
    </section>
  );
};

export default AccountSetup;
