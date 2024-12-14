import React, { useState, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import axiosConfig from "../../service/axios";
import accountSetup from "../../../../public/assets/account-setup.png"

const AccountSetup: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFront, setFrontPreview] = useState<string | null>(null);
  const [imageBack, setBackPreview] = useState<string | null>(null);
  const [selectedID, setSelectedID] = useState<string>("debit_card");
  const [IDNumber, setIDNumber] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImagePreview(fileURL);
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
            setFrontPreview(reader.result);
          } else if (side === "back") {
            setBackPreview(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleIDChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedID(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    const formData = new FormData();

    formData.append("firstName",firstName);
    formData.append("lastName",lastName);
    formData.append("phone",phone);
    formData.append("dateOfBirth",dob);
    formData.append("selectedID",selectedID);
    formData.append("IDNumber",IDNumber);
    if (imagePreview) {
      formData.append("profileImage", imagePreview);
    }
    // if(imageFront)formData.append("imageFront",imageFront);
    // if(imageBack)formData.append("imageBack",imageBack); 

    try {
      const response = await axiosConfig.post(
        "/users/setup-account",
        formData
      );

      if (response.status === 200) {
        console.log("Form submitted successfully:", response.data);
        alert("Profile setup completed successfully!");
      }
    } catch (error) {
      console.error("Failed to submit form data:", error);
      alert("There was an error submitting your profile.");
    }
  };

  return (
    <section id="hero" className="hero section pt-20 pb-16 bg-gradient-to-r from-blue-100 to-white w-full overflow-hidden">
      <div className="container mx-20 px-6">
      <h1 className="text-3xl md:text-4xl font-bold leading-tight text-center mx-auto mb-4 mt-6 w-full">
        Set Up your Account <br />
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Fill in your personal details and upload required documents to get started.
      </p>
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <div className="hero-content text-left">
            <form className="w-full max-w-3xl space-y-8" onSubmit={handleSubmit}>
          {/* Profile Photo and Personal Information */}
          <div className="flex gap-8 items-start mb-6">
            {/* Profile Photo */}
            <div className="relative w-32 h-32 bg-gray-500 rounded-md my-7 flex justify-center items-center overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-300">Upload Photo</span>
              )}

              {/* Edit Icon */}
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
             {/* Profile Details */}
        <div className="col-span-2 space-y-3">
           {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-blue-600 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Tom"
                  />
                </div>
                <div>
                  <label className="block text-sm text-blue-600 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-blue-600 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div>
                  <label className="block text-sm text-blue-600 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ID Verification Section */}
          <h2 className="text-xl font-semibold mt-6 text-blue-600">ID Verification</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-blue-600 mb-2">Select ID Type</label>
              <select
                className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                onChange={handleIDChange}
                value={selectedID}
              >
                <option value="debit_card">💳 Debit/Credit Card</option>
                <option value="passport">🌍 Passport</option>
                <option value="driver_license">🚗 Driver's License</option>
                <option value="national_id">🆔 National ID</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-blue-600 mb-2">ID Number</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter your ID number"
                value={IDNumber}
                onChange={(e) => setIDNumber(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
  <div>
    <label htmlFor="id-front-upload" className="block text-sm text-blue-600 mb-2">
      Upload ID Front
    </label>
    <label
      htmlFor="id-front-upload"
      className="cursor-pointer px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-semibold"
    >
      Upload Front
    </label>
    <input
      id="id-front-upload"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => handleIdImageUpload(e, "front")}
    />
    {imageFront && (
      <div className="mt-4">
        <img
          src={imageFront}
          alt="ID Front Preview"
          className="w-full h-48 object-cover rounded-lg border border-gray-300"
        />
      </div>
    )}
  </div>
  <div>
    <label htmlFor="id-back-upload" className="block text-sm text-blue-600 mb-2">
      Upload ID Back
    </label>
    <label
      htmlFor="id-back-upload"
      className="cursor-pointer px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-semibold"
    >
      Upload Back
    </label>
    <input
      id="id-back-upload"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => handleIdImageUpload(e, "back")}
    />
    {imageBack && (
      <div className="mt-4">
        <img
          src={imageBack}
          alt="ID Back Preview"
          className="w-full h-48 object-cover rounded-lg border border-gray-300"
        />
      </div>
    )}
  </div>
</div>


          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <div className="text-center">
              <img
                src="/assets/account-setup.png"
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
