import React, { useState, useEffect } from "react";
import axiosConfig from "../../service/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TaskFormValidation } from "../../components/Schemas/taskFormValidation";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
}

const TaskSubmissionForm: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const clientId = localStorage.getItem("userId");

  const initialValues = {
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
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosConfig.get("/users/categories");
        if (response.status === 200) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories", error);
        toast.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput)) {
      setSkills((prevSkills) => [...prevSkills, skillInput]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prevSkills) => prevSkills.filter((s) => s !== skill));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(
        (file) => file.size <= 5 * 1024 * 1024
      );
      setAttachments((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setAttachments(attachments.filter((file) => file.name !== fileName));
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("clientId", clientId || "");
    formData.append("projectName", values.projectName);
    formData.append("category", values.category);
    formData.append("timeline", values.timeline);
    formData.append("rateType", values.rateType);
    formData.append("minRate", String(values.minRate));
    formData.append("maxRate", String(values.maxRate));
    formData.append("description", values.description);
    skills.forEach((skill, index) =>
      formData.append(`skills[${index}]`, skill)
    );
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      const response = await axiosConfig.post("/client/create-task", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Task submitted successfully!");
      } else {
        toast.error(
          `Error: ${response.data.message || "Failed to submit task"}`
        );
      }
    } catch (error) {
      toast.error( "An error occurred while submitting the task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="hero"
      className="hero section pt-20 pb-16 bg-gradient-to-r from-blue-100 to-white w-full overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-center mx-auto mb-4 mt-6">
          Post a Task <br />
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Fill in your task details and submit to post the task.
        </p>
        <div className="flex justify-center items-center">
          <Formik
            initialValues={initialValues}
            validationSchema={TaskFormValidation}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form className="w-full max-w-7xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Project Name
                    </label>
                    <Field
                      type="text"
                      name="projectName"
                      className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g. Build me a website"
                    />
                    <ErrorMessage
                      name="projectName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  {/* Category */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Category
                    </label>
                    <Field
                      as="select"
                      name="category"
                      className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Timeline, Rate Type, Min/Max Rate */}
                <div className="flex flex-wrap space-x-4">
                  <div className="w-full sm:w-full lg:w-1/3">
                    <label className="block text-sm text-gray-700 mb-2">Timeline / Deadline</label>
                    <Field
                      type="date"
                      name="timeline"
                      className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder=""
                    />
                    <ErrorMessage
                      name="timeline"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="flex space-x-4 w-full sm:w-full  lg:w-1/2">
                    <div className="flex items-center w-full lg:w-1/4">
                    <Field
                      type="radio"
                      id="hourly"
                      name="rateType"
                      className="h-4 w-4 text-blue-600"
                      value="hourly"
                    />
                      <label htmlFor="hourly" className="ml-2 text-sm text-gray-700">
                        Hourly Rate
                      </label>
                    </div>
                    <div className="flex items-center w-full  lg:w-1/4">
                    <Field
                      type="radio"
                      id="fixed"
                      name="rateType"
                      className="h-4 w-4 text-blue-600"
                      value="fixed"
                    />
                      <label htmlFor="fixed" className="ml-2 text-sm text-gray-700">
                        Fixed Rate
                      </label>
                    </div>

                    <div className="w-full lg:w-1/4">
                      <label className="block text-sm text-gray-700 mb-2">Minimum Rate</label>
                      <Field
                      type="number"
                      name="minRate"
                      className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g. 100"
                    />
                    <ErrorMessage
                      name="minRate"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    </div>
                    <div className="w-full lg:w-1/4">
                      <label className="block text-sm text-gray-700 mb-2">Maximum Rate</label>
                      <Field
                      type="number"
                      name="maxRate"
                      className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g. 500"
                    />
                    <ErrorMessage
                      name="maxRate"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    </div>
                  </div>
                </div>

                {/* Skills and Attachments */}
                <div className="flex sm:flex-col lg:flex-row lg:space-x-4">
                  {/* Required Skills */}
                  <div className="w-full sm:w-full lg:w-1/2">
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
                    <ErrorMessage
                      name="skills"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* File Attachments */}
                  <div className="w-full sm:w-full lg:w-1/2">
                    <label className="block text-sm text-gray-700 mb-2">Attachments (max 5MB each)</label>
                    <input
                      type="file"
                      name="attachments"
                      multiple
                      className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      onChange={handleFileChange}
                    />
                    <ErrorMessage
                      name="attachments"
                      component="div"
                      className="text-red-500 text-sm mt-1"
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

                {/* Task Description */}
                <div className="w-full">
                  <label className="block text-sm text-gray-700 mb-2">Task Description</label>
                  <Field
                    as="textarea"
                    name="description"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    rows={4}
                    placeholder="Describe the task in detail"
                   
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                 {/* Submit Button */}
                 <div className="text-center">
                  <button
                    type="submit"
                    className={`px-6 py-3 bg-blue-600 text-white rounded font-medium ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Task"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default TaskSubmissionForm;
