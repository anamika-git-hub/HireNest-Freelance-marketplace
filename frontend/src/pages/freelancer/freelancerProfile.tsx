import React, { useState, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import axiosConfig from "../../service/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const FreelancerProfile: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [attachments, setAttachments] = useState(
    [] as { id: string; file: File; title: string; description: string }[]
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const [firstName, setFirstName] = useState("");
  const [location, setLocation] = useState("");
  const [tagline, setTagline] = useState("");
  const [experience, setExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState<number>(35);
  const [introduction, setIntroduction] = useState("");

  const navigate = useNavigate()

   const currentUserId = useSelector((state: RootState) => state.user.userId);

  const fileInputRef = useRef<HTMLInputElement>(null);

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const fileURL = URL.createObjectURL(file);
        setImagePreview(fileURL);
        setImageFile(file)
      }
    };
    const handleEditClick = () => {
      fileInputRef.current?.click(); 
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setHourlyRate(Number(value)); 
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
        file: modalFile,
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();

formData.append("userId",currentUserId || "");    
formData.append("name", firstName);
formData.append("location", location);
formData.append("tagline", tagline);
formData.append("experience", experience);
formData.append("hourlyRate", hourlyRate.toString());
formData.append("description", introduction);

if (imageFile) {
  formData.append("profileImage", imageFile);
}

skills.forEach((skill) => formData.append("skills[]", skill));

attachments.forEach((attachment, index) => {
  formData.append(`attachments`, attachment.file);
  formData.append(`attachments[${index}].title`, attachment.title);
  formData.append(`attachments[${index}].description`, attachment.description);
});


    try {
      const response = await axiosConfig.post("/freelancers/setup-freelancer-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile submitted successfully!");
      navigate('/login')
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the profile. Please try again.");
    }
  };

  return (
    <section id="hero" className="hero section pt-20 pb-16 bg-gradient-to-r from-blue-100 to-white w-full overflow-hidden">
    <div className="container mx-20 px-6">
    <h1 className="text-3xl md:text-4xl font-bold leading-tight text-center mx-auto mb-4 mt-6 w-full">
      Complete Freelancer Profile <br />
    </h1>
    <p className="text-gray-600 mb-6 text-center">
      Fill in your  details and upload required documents to set up your profile.
    </p>
      <div className="flex flex-col lg:flex-row items-center">
        {/* Left Content */}
        <div className="lg:w-1/2">
          <div className="hero-content text-left">
          <form className="w-full max-w-3xl space-y-8 mt-8" onSubmit={handleSubmit}>
      
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
              <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
             />
            </div>
          </div>

            {/* Tagline and Experience */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Tagline</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Web Developer"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Experience</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3 years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>


      {/* Hourly Rate and Skills */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Set Your Minimal Hourly Rate
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-lg font-medium">$</span>
            <input
              type="number"
              className="w-24 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="35"
              value={hourlyRate}
              onChange={handleChange} 
            />
             <input
              type="range"
              className="flex-grow w-72"
              min="10"
              max="100"
              step="1"
              defaultValue={35}
              value={hourlyRate}
              onChange={handleChange} 
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Skills</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 rounded bg-blue-100 text-blue-600 text-sm font-medium"
              >
                {skill}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2 mt-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Add a skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleAddSkill}
            >
              Add
            </button>
          </div>
        </div>
      </div>

       {/* Introduction */}
       <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Introduce Yourself</label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Write about yourself..."
          rows={4}
          value={introduction}
              onChange={(e)=>setIntroduction(e.target.value)}
          
        ></textarea>
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Attachments</label>
        <button
        type="button"
          className="px-4 py-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium"
          onClick={() => setModalVisible(true)}
        >
          Upload Files
        </button>
        <div className="mt-4 space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center p-4 border border-gray-300 rounded"
            >
              <img
                src={URL.createObjectURL(attachment.file)}
                alt={attachment.title}
                className="w-16 h-16 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <h4 className="text-gray-800 font-medium">{attachment.title}</h4>
                <p className="text-gray-600 text-sm">{attachment.description}</p>
              </div>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveAttachment(attachment.id)}
              >
                Remove
              </button>
            </div>
            ))}
        </div>
</div>

{/* Modal for Adding Attachments */}
{modalVisible && (
<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Attachment</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">File</label>
        <input
          type="file"
          className="w-full"
          onChange={(e) => setModalFile(e.target.files ? e.target.files[0] : null)}
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          value={modalTitle}
          onChange={(e) => setModalTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          value={modalDescription}
          onChange={(e) => setModalDescription(e.target.value)}
          rows={3}
        ></textarea>
      </div>
    </div>
    <div className="mt-6 flex justify-end space-x-2">
      <button
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
        onClick={() => setModalVisible(false)}
      >
        Cancel
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleFileUpload}
      >
        Add
      </button>
    </div>
  </div>
</div>
)}
{/* Submit Button */}
<div className="mt-6 flex justify-center">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Submit Profile
        </button>
      </div>

 </form>

 </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 mt-10 lg:mt-0 mb-40">
            <div className="text-center">
              <img
                src="/assets/freelancer-profile.png"
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

export default FreelancerProfile;

