import React, { useState, useEffect, useRef } from "react";
import axiosConfig from "../../service/axios";
import { useParams } from "react-router-dom"; 

interface TaskDetail {
    projectName: string;
    category: string;
    timeline: string;
    skills: string[];
    skillInput: string;
    rateType: string;
    minRate: string;
    maxRate: string;
    description: string;
    attachments: File[],
}

const TaskDetailForm: React.FC = () => {
const { id } = useParams<{ id: string }>(); 
const fileInputRef = useRef<HTMLInputElement>(null);
const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
const [formData,setFormData] = useState ({
    projectName: "",
    category: "",
    timeline: "",
    skills: [] as string[],
    skillInput: "",
    rateType: "hourly",
    minRate: "",
    maxRate: "",
    description: "",
    attachments: [] as File[],
})

useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const response = await axiosConfig.get(`/freelancers/tasks/${id}`);
        console.log('resssss',response.data)
        if (response.data) {
           const task = response.data.task;
          setTaskDetail(response.data.task);
          setFormData({
            projectName: task.projectName,
            category: task.category,
            timeline: task.timeline,
            skills: task.skills || [],
            skillInput: "",
            rateType: task.rateType,
            minRate: task.minRate,
            maxRate: task.maxRate,
            description: task.description,
            attachments: task.attachments || [],
          });
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };
    fetchTaskDetail();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (formData.skillInput.trim() && !formData.skills.includes(formData.skillInput)) {
      setFormData(prevState => ({
        ...prevState,
        skills: [...prevState.skills, formData.skillInput],
        skillInput: ''
      }));
    }
  };

  const handleRemoveSkill = (skill:string) => {
    setFormData(prevState => ({
      ...prevState,
      skills: prevState.skills.filter(s => s !== skill)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
        const newFiles = Array.from(files).filter(
          (file) => file.size <= 5 * 1024 * 1024 
        );
    setFormData(prevState => ({
      ...prevState,
      attachments: [...newFiles]
    }));
  };
  };
  const handleRemoveFile = (fileName:string) => {
    setFormData(prevState => ({
      ...prevState,
      attachments: prevState.attachments.filter(file => file.name !== fileName)
    }));
  };

      const handleSubmit =  async (e: React.FormEvent) => {
        e.preventDefault();
  
        const updatedData = new FormData();
        updatedData.append("projectName", formData.projectName);
        updatedData.append("category", formData.category);
        updatedData.append("timeline", formData.timeline);
        updatedData.append("rateType", formData.rateType);
        updatedData.append("minRate", String(formData.minRate));
        updatedData.append("maxRate", String(formData.maxRate));
        updatedData.append("description", formData.description);
        formData.skills.forEach((skill, index) =>
            updatedData.append(`skills[${index}]`, skill)
          );
        formData.attachments.forEach((file) => updatedData.append("attachments", file));
    
        try {
          const response = await axiosConfig.put(`/client/update-task/${id}`, updatedData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
    
          if (response.status === 200) {
            alert("Task updated successfully!");
            
          } else {
            alert(`Error: ${response.data.message || "Failed to submit task"}`);
          }
        } catch (error: any) {
          console.error("Submission error:", error);
          alert(error.response?.data?.message || "An error occurred while submitting the task.");
        } 
      };
      return (
        <form onSubmit={handleSubmit} className="p-10 pt-20 bg-white rounded-lg shadow-lg">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Update Task</h3>
            
            {/* Project Name and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
    
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700">Timeline / Deadline</label>
                <input
                  type="date"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div  className="flex items-center space-x-4 w-1/2">
              <div className="flex items-center w-1/4" >
                  <input
                    type="radio"
                    id="hourly"
                    name="rateType"
                    value="hourly"
                    checked={formData.rateType === 'hourly'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="hourly" className="ml-2 text-sm text-gray-700">Hourly Rate</label>
                  </div>
                <div className="flex items-center w-1/4">
                  <input
                    type="radio"
                    id="fixed"
                    name="rateType"
                    value="fixed"
                    checked={formData.rateType === 'fixed'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="fixed" className="ml-2 text-sm text-gray-700">Fixed Rate</label>
                </div>

              <div className="w-1/4">
                <label className="block text-sm font-medium text-gray-700">Minimum Rate</label>
                <input
                  type="number"
                  name="minRate"
                  value={formData.minRate}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 100"
                />
              </div>
    
              <div  className="w-1/4">
                <label className="block text-sm font-medium text-gray-700">Maximum Rate</label>
                <input
                  type="number"
                  name="maxRate"
                  value={formData.maxRate}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 500"
                />
              </div>
              </div>
            </div>
    
            {/* Skills */}
            <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Required Skills</label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  name="skillInput"
                  value={formData.skillInput}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a skill"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map(skill => (
                  <span key={skill} className="inline-flex items-center px-3 py-1 rounded bg-blue-100 text-blue-600 text-sm font-medium">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
    
            {/* Attachments */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Attachments (max 5MB each)</label>
              <input
                type="file"
                name="attachments"
                multiple
                onChange={handleFileChange}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="mt-2">
                {formData.attachments.map(file => (
                  <div key={file.name} className="flex justify-between items-center border p-2 rounded bg-gray-50 mb-2">
                    <span className="text-sm">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.name)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              </div>
            </div>
    
            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Task Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows={4}
                placeholder="Describe the task in detail"
              />
            </div>
    
            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Post Task
              </button>
            </div>
          </div>
        </form>
      );    
};

export default TaskDetailForm;