import React, { useState } from "react";
import axiosConfig from "../../service/axios";

const TaskSubmissionForm: React.FC = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>("");
  const [rateType, setRateType] = useState<string>("hourly");
  const [minRate, setMinRate] = useState<number | string>("");
  const [maxRate, setMaxRate] = useState<number | string>("");
  const [description, setDescription] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  // Handling skills
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput)) {
      setSkills((prevSkills) => [...prevSkills, skillInput]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prevSkills) => prevSkills.filter((s) => s !== skill));
  };

  // Handling file uploads with preview and validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(
        (file) => file.size <= 5 * 1024 * 1024 // 5MB limit
      );
      setAttachments((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setAttachments(attachments.filter((file) => file.name !== fileName));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("projectName", projectName);
      formData.append("category", category);
      formData.append("timeline", timeline);
      formData.append("rateType", rateType);
      formData.append("minRate", String(minRate));
      formData.append("maxRate", String(maxRate));
      formData.append("description", description);
      skills.forEach((skill, index) => formData.append(`skills[${index}]`, skill));
      attachments.forEach((file) => formData.append("attachments", file));
  
      const response = await axiosConfig.post("/client/create-task", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        alert("Task submitted successfully!");
      } else {
        alert(`Error: ${response.data.message || "Failed to submit task"}`);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(error.response?.data?.message || "An error occurred while submitting the task.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <section
      id="hero"
      className="hero section pt-20 pb-16 bg-gradient-to-r from-blue-100 to-white w-full overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-center mx-auto mb-4 mt-6">
          Post a Task <br />
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Fill in your task details and submit to get started.
        </p>
        <div className="flex justify-center items-center">
          <form
            className="w-full max-w-7xl space-y-8"
            onSubmit={handleSubmit} // Add handleSubmit here
          >
            {/* Project Name and Category */}
            <div className="flex space-x-4">
              <div className="w-full">
                <label className="block text-sm text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Build me a website"
                />
              </div>
              <div className="w-full">
                <label className="block text-sm text-gray-700 mb-2">Category</label>
                <select
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="web_development">Web Development</option>
                  <option value="graphic_design">Graphic Design</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
            </div>

            {/* Timeline, Rate Type, Min/Max Rate */}
            <div className="flex space-x-4">
              <div className="w-1/3">
                <label className="block text-sm text-gray-700 mb-2">Timeline / Deadline</label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-4 w-1/2">
                <div className="flex items-center w-1/4">
                  <input
                    type="radio"
                    id="hourly"
                    name="rateType"
                    value="hourly"
                    checked={rateType === "hourly"}
                    onChange={() => setRateType("hourly")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="hourly" className="ml-2 text-sm text-gray-700">
                    Hourly Rate
                  </label>
                </div>
                <div className="flex items-center w-1/4">
                  <input
                    type="radio"
                    id="fixed"
                    name="rateType"
                    value="fixed"
                    checked={rateType === "fixed"}
                    onChange={() => setRateType("fixed")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="fixed" className="ml-2 text-sm text-gray-700">
                    Fixed Rate
                  </label>
                </div>

                <div className="w-1/4">
                  <label className="block text-sm text-gray-700 mb-2">Minimum Rate</label>
                  <input
                    type="number"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                    placeholder="Enter minimum rate"
                  />
                </div>

                <div className="w-1/4">
                  <label className="block text-sm text-gray-700 mb-2">Maximum Rate</label>
                  <input
                    type="number"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                    placeholder="Enter maximum rate"
                  />
                </div>
              </div>
            </div>

            {/* Skills and Attachments */}
            <div className="flex space-x-4">
              {/* Required Skills */}
              <div className="w-1/2">
                <label className="block text-sm text-gray-700 mb-2">Required Skills</label>
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
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded bg-blue-100 text-blue-600 text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        className="ml-2 text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* File Attachments */}
              <div className="w-1/2">
                <label className="block text-sm text-gray-700 mb-2">Attachments (max 5MB each)</label>
                <input
                  type="file"
                  multiple
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  onChange={handleFileChange}
                />
                <div className="mt-2">
                  {attachments.map((file) => (
                    <div
                      key={file.name}
                      className="flex justify-between items-center border p-2 rounded bg-gray-50 mb-2"
                    >
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveFile(file.name)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of your task"
                rows={4}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-6 py-2 rounded text-white ${
                  loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Post Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TaskSubmissionForm;
