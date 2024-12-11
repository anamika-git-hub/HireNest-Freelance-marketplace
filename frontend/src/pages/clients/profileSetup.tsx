import React, { useState, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import axiosConfig from "../../service/axios";

const ClientProfileSetup: React.FC = () => {
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
    e.preventDefault(); // Prevent default form submission

    // Prepare data payload to send to backend
    const formData = {
      firstName,
      lastName,
      phone,
      dateOfBirth: dob,
      selectedID,
      IDNumber,
      imagePreview, 
      imageFront,
      imageBack,
    };

    try {
      const response = await axiosConfig.post(
        "/users/setup-profile",
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
    <div className="min-h-screen flex">

      {/* Right Side with Form */}
      <div className="w-4/6 bg-blue-950 text-white flex items-center justify-center p-8">
      <form className="w-full max-w-3xl space-y-8" onSubmit={handleSubmit}>
      <h1 className="text-center text-3xl font-bold mb-6">Complete your Profile</h1>

    {/* Profile Photo and Personal Information */}
    <div className="w-auto flex gap-8 items-start mb-6">
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
      <div className="flex flex-col gap-4 w-full">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white mb-2">First Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-transparent text-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Tom"
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-2">Last Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-transparent text-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Smith"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white mb-2">Phone</label>
            <input
              type="tel"
              className="w-full px-4 py-2 bg-transparent text-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(123) 456-7890"
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-2">Date of Birth</label>
            <input
              type="date"
              className="w-full px-4 py-2 bg-transparent text-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
   

    {/* ID Verification Section */}
    <h2 className="text-xl font-semibold mt-6">ID Verification</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-white mb-2">Select ID Type</label>
        <select
          className="w-full px-4 py-2 bg-transparent text-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
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
        <label className="block text-sm text-white mb-2">ID Number</label>
        <input
          type="text"
          className="w-full px-4 py-2 bg-transparent text-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
          placeholder="Enter your ID number"
          value={IDNumber}
          onChange={(e) => setIDNumber(e.target.value)}
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="id-front-upload"
          className="block text-sm text-white mb-2"
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
          id="id-front-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleIdImageUpload(e, "front")}
        />
      </div>
      <div>
        <label
          htmlFor="id-back-upload"
          className="block text-sm text-white mb-2"
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
          id="id-back-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleIdImageUpload(e, "back")}
        />
      </div>
    </div>

    {/* Submit Button */}
    <div className="flex justify-center mt-6">
      <button
        type="submit"
        className="px-6 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-semibold"
      >
        Submit
      </button>
    </div>
  </form>
</div>

        {/* Left Side with Image */}
        <div
        className="w-2/6 bg-cover bg-center flex items-center justify-center relative"
        style={{
          backgroundImage: "url('https://img.freepik.com/premium-photo/icon-illustration-software-developer_853677-72777.jpg')", // Replace with the correct path
          backgroundColor: "#f7f7f7",
        }}
      ></div>
    </div>
  );
};

export default ClientProfileSetup;
