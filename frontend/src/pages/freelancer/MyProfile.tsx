import React, { useState, useEffect, useRef } from "react";
import axiosConfig from "../../service/axios";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";

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
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    tagline: "",
    experience: "",
    hourlyRate: 0,
    skills: [] as string[],
    description: "",
    profileImage: "",
  });
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
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchFreelancerProfile();
  }, []);

  useEffect(() => {
    if (freelancerProfile) {
      setFormData({
        name: freelancerProfile.name || "",
        location: freelancerProfile.location || "",
        tagline: freelancerProfile.tagline || "",
        experience: freelancerProfile.experience || "",
        hourlyRate: freelancerProfile.hourlyRate || 0,
        profileImage: freelancerProfile.profileImage || "",
        skills: freelancerProfile.skills || [],
        description: freelancerProfile.description || "",
      });
      setSkills(freelancerProfile.skills);
    }
  }, [freelancerProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file), 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = new FormData();
    updatedData.append("name", formData.name);
    updatedData.append("location", formData.location);
    updatedData.append("tagline", formData.tagline);
    updatedData.append("experience", formData.experience);
    updatedData.append("hourlyRate", formData.hourlyRate.toString());
    skills.forEach((skill) => updatedData.append("skills[]", skill));
    updatedData.append("description", formData.description);

    if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
      updatedData.append("profileImage", fileInputRef.current.files[0]);
    }

    try {
        const response = await axiosConfig.put(`/freelancers/update-freelancer-profile`, updatedData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("freelancer profile updated:", response.data);
        if(response.status === 200){
          toast.error('freelancer profile updated successfully')
        }
      
    } catch (error) {
      toast.error('Error updating user details')
      console.error("Error updating user details:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-10 pt-20 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">My Account</h3>
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="w-32 h-32 mt-16 bg-gray-200 rounded-md flex justify-center items-center text-gray-500 relative">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span>Photo</span>
              )}
              <div
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full"
                onClick={handleEditClick}
              >
                <FaEdit className="fas fa-edit" />
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            {/* Form Section */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Tagline and Experience */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Hourly Rate ($)
                  </label>
                  <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-lg font-medium">$</span>
                  <input
                    type="number"
                    name="hourlyRate"
                    className="w-24 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                  />
            <input
              type="range"
              name="hourlyRate"
              className="flex-grow w-72"
              min="10"
              max="100"
              step="1"
              value={formData.hourlyRate}
              onChange={handleChange}
              
            />
              </div>
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
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Add
                  </button>
                </div>
                <ul className="mt-2 space-y-1 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                      <span
                        key = {skill}
                        className="inline-flex items-center px-3 py-1 rounded bg-blue-100 text-blue-600 text-sm font-medium"
                        >
                          {skill}
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
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
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attachment Modal */}
        {modalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
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
    </form>
  );
};

export default MyProfile;
