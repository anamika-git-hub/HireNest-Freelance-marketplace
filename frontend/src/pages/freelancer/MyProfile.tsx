import React, { useState, useEffect, useRef } from "react";
import axiosConfig from "../../service/axios";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FreelancerProfileValidationSchema } from "../../components/Schemas/freelancerProfile";

interface FreelancerProfile {
  name: string;
  location: string;
  tagline: string;
  experience: string;
  hourlyRate: number;
  skills: string[];
  description: string;
  profileImage: string | null;
  attachments: {
    id: string;
    file: string;
    title: string;
    description: string;
  }[];
}

const MyProfile: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfile | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<
    { id: string; file: string; title: string; description: string }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await axiosConfig.get(`/users/freelancer-profile/${userId}`);
          setFreelancerProfile(response.data);
          setSkills(response.data.skills || []);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchFreelancerProfile();
  }, []);

  const initialValues = {
    name: freelancerProfile?.name || "",
    location: freelancerProfile?.location || "",
    tagline: freelancerProfile?.tagline || "",
    experience: freelancerProfile?.experience || "",
    hourlyRate: freelancerProfile?.hourlyRate || 10,
    description: freelancerProfile?.description || "",
    profileImage: freelancerProfile?.profileImage || "",
  };

  const handleAddSkill = (setFieldValue: (field: string, value: string[]) => void) => {
    if (skillInput.trim() && !skills.includes(skillInput)) {
      const newSkills = [...skills, skillInput];
      setSkills(newSkills);
      setFieldValue('skills', newSkills);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string, setFieldValue: (field: string, value: string[]) => void) => {
    const newSkills = skills.filter((s) => s !== skill);
    setSkills(newSkills);
    setFieldValue('skills', newSkills);
  };

  const handleFileUpload = () => {
    if (modalFile && modalTitle) {
      const newAttachment = {
        id: Math.random().toString(),
        file: URL.createObjectURL(modalFile),
        title: modalTitle,
        description: modalDescription,
      };
      setAttachments([...attachments, newAttachment]);
      setModalVisible(false);
      setModalFile(null);
      setModalTitle("");
      setModalDescription("");
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {

    const updatedData = new FormData();
    updatedData.append("name", values.name);
    updatedData.append("location", values.location);
    updatedData.append("tagline", values.tagline);
    updatedData.append("experience", values.experience);
    updatedData.append("hourlyRate", values.hourlyRate.toString());
    skills.forEach((skill) => updatedData.append("skills[]", skill));
    updatedData.append("description", values.description);

    if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
      updatedData.append("profileImage", fileInputRef.current.files[0]);
    }

    try {
        const response = await axiosConfig.put(`/freelancers/update-freelancer-profile`, updatedData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if(response.status === 200){
          toast.success('freelancer profile updated successfully')
        }
      
    } catch (error) {
      toast.error('Error updating user details')
      console.error("Error updating user details:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
    enableReinitialize
    initialValues={initialValues}
    validationSchema={FreelancerProfileValidationSchema}
    onSubmit={handleSubmit}
  >
    {({ isSubmitting, setFieldValue, values }) => (
    <Form className="p-6 md:p-10 bg-white rounded-lg shadow-lg">
      <div className="h-[calc(100vh-6rem)] overflow-y-auto space-y-6 pt-16">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">My Profile</h3>
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-6 md:space-y-0">
            {/* Profile Picture */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-md flex justify-center items-center text-gray-500 relative">
              {values.profileImage ? (
                <img
                  src={values.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span>Photo</span>
              )}
              <div
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
                onClick={handleEditClick}
              >
                <FaEdit className="fas fa-edit" />
              </div>
            </div>
  
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFieldValue('profileImage', URL.createObjectURL(file));
                }
              }}
              className="hidden"
              accept="image/*"
            />
  
            {/* Form Section */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <Field
                    type="text"
                    name="name"
                    value={values.name}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                   <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>
  
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <Field
                    type="text"
                    name="location"
                    value={values.location}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                   <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
  
              {/* Tagline and Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tagline</label>
                  <Field
                    type="text"
                    name="tagline"
                    value={values.tagline}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="tagline" component="div" className="text-red-500 text-sm mt-1" />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <Field
                    type="text"
                    name="experience"
                    value={values.experience}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                   <ErrorMessage name="experience" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
  
              {/* Hourly Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Hourly Rate ($)
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 text-lg font-medium">$</span>
                    <Field
                      type="number"
                      name="hourlyRate"
                      className="w-24 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      value={values.hourlyRate}
                    />
                    <Field
                      type="range"
                      name="hourlyRate"
                      className="flex-grow w-full"
                      min="10"
                      max="100"
                      step="1"
                      value={values.hourlyRate}
                    />
                  </div>
                  <ErrorMessage name="hourlyRate" component="div" className="text-red-500 text-sm mt-1" />
                </div>
  
                {/* Skills */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Skills</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      className="px-4 py-2 border border-gray-300 rounded"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill(setFieldValue)}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-3 py-1 rounded bg-blue-100 text-blue-600 text-sm font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill, setFieldValue)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </ul>
                </div>
              </div>
  
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  value={values.description}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                 <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>
          </div>
        </div>
  
        {/* Attachment Modal */}
        {modalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h4 className="text-lg font-semibold">Upload Attachment</h4>
              <input
                type="file"
                onChange={(e) => setModalFile(e.target.files ? e.target.files[0] : null)}
                className="mt-2"
              />
              <input
                type="text"
                placeholder="Title"
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={modalDescription}
                onChange={(e) => setModalDescription(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={4}
              />
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setModalVisible(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Attachments List */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Attachments</h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-4">{attachment.title}</span>
                  <span className="text-sm text-gray-500">{attachment.description}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  className="text-red-500 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setModalVisible(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Attachment
          </button>
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Save Changes
        </button>
      </div>
    </Form>
    )}
    </Formik>
  );
  
};

export default MyProfile;
