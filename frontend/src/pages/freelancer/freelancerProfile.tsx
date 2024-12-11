import React, { useState } from "react";

const FreelancerProfile: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [attachments, setAttachments] = useState(
    [] as { id: string; file: File; title: string; description: string }[]
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

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

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Freelancer Profile</h3>

      <div className="grid grid-cols-3 gap-4 items-start">
  {/* Profile Photo */}
  <div className="relative col-span-1 flex items-start justify-start">
    <div className="w-45 h-40 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100 relative">
      <img
        src="https://via.placeholder.com/150"
        alt="Profile"
        className="object-cover w-full h-full"
        onError={(e) =>
          (e.currentTarget.src = "https://via.placeholder.com/150?text=Photo")
        }
      />
      {/* Edit Icon */}
      <button
        className="absolute bottom-4 right-5 transform translate-x-1 translate-y-1 p-2 bg-blue-600 text-white rounded-full text-xs z-10"
        aria-label="Edit Profile Picture"
      >
        ✎
      </button>
    </div>
   
  </div>

  {/* Profile Details */}
  <div className="col-span-2 space-y-3">
    {/* Name Fields */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">First Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="First Name"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Location"
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
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Experience</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 3 years"
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
            />
             <input
              type="range"
              className="flex-grow w-72"
              min="10"
              max="100"
              step="1"
              defaultValue={35}
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
          
        ></textarea>
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Attachments</label>
        <button
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
                className="px-4 py-2 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveAttachment(attachment.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Uploading Attachments */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg space-y-4 w-96">
            <h3 className="text-lg font-medium text-gray-800">Upload Attachment</h3>
            <input
              type="file"
              onChange={(e) => setModalFile(e.target.files?.[0] || null)}
              className="block w-full px-4 py-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Title"
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Description"
              value={modalDescription}
              onChange={(e) => setModalDescription(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleFileUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FreelancerProfile;
