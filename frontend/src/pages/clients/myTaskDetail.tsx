import React, { useState, useEffect} from "react";
import axiosConfig from "../../service/axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TaskFormValidation } from "../../components/Schemas/taskFormValidation";

interface TaskDetail {
    projectName: string;
    category: string;
    timeline: string;
    rateType: string;
    minRate: string;
    maxRate: string;
    description: string;
    attachments: File[];
    skills: string[];
}

const TaskDetailForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  const [skillInput, setSkillInput] = useState("");


  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const response = await axiosConfig.get(`/users/tasks/${id}`);
        if (response.data) {
          setTaskDetail(response.data.task);
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };
    fetchTaskDetail();
  }, [id]);

  console.log(taskDetail,'dkfjslkfjsdk')
  const initialValues = {
    projectName:taskDetail?.projectName || "",
    category:taskDetail?.category || "",
    timeline:taskDetail?.timeline || "",
    rateType: taskDetail?.rateType || "hourly",
    minRate: taskDetail?.minRate || "",
    maxRate: taskDetail?.maxRate || "",
    description: taskDetail?.description || "",
    attachments: taskDetail?.attachments || [],
    skills: taskDetail?.skills || []
  };

  const handleSubmit = async (values: TaskDetail, { setSubmitting }: any) => {
    const updatedData = new FormData();
    updatedData.append("projectName", values.projectName);
    updatedData.append("category", values.category);
    updatedData.append("timeline", values.timeline);
    updatedData.append("rateType", values.rateType);
    updatedData.append("minRate", String(values.minRate));
    updatedData.append("maxRate", String(values.maxRate));
    updatedData.append("description", values.description);
    values.skills.forEach((skill, index) =>
      updatedData.append(`skills[${index}]`, skill)
    );
    values.attachments.forEach((file) => updatedData.append("attachments", file));

    try {
      const response = await axiosConfig.put(`/client/update-task/${id}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Task updated successfully!");
      } else {
        toast.error(`Error: ${response.data.message || "Failed to submit task"}`);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "An error occurred while submitting the task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={TaskFormValidation}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="p-10 pt-20 bg-white rounded-lg shadow-lg">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Update Task</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <Field
                  type="text"
                  name="projectName"
                  value = {values.projectName}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="projectName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <Field
                  as="select"
                  name="category"
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="web_development">Web Development</option>
                  <option value="graphic_design">Graphic Design</option>
                  <option value="marketing">Marketing</option>
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">Timeline / Deadline</label>
                <Field
                  type="date"
                  name="timeline"
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="timeline" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex items-center space-x-4 w-1/2">
                <div className="flex items-center w-1/4">
                  <Field
                    type="radio"
                    name="rateType"
                    value="hourly"
                    className="h-4 w-4 text-blue-600"
                  />
                  <label className="ml-2 text-sm text-gray-700">Hourly Rate</label>
                </div>

                <div className="flex items-center w-1/4">
                  <Field
                    type="radio"
                    name="rateType"
                    value="fixed"
                    className="h-4 w-4 text-blue-600"
                  />
                  <label className="ml-2 text-sm text-gray-700">Fixed Rate</label>
                </div>

                <div className="w-1/4">
                  <label className="block text-sm font-medium text-gray-700">Minimum Rate</label>
                  <Field
                    type="number"
                    name="minRate"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 100"
                  />
                  <ErrorMessage name="minRate" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="w-1/4">
                  <label className="block text-sm font-medium text-gray-700">Maximum Rate</label>
                  <Field
                    type="number"
                    name="maxRate"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 500"
                  />
                  <ErrorMessage name="maxRate" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a skill"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (skillInput.trim() && !values.skills.includes(skillInput)) {
                        setFieldValue('skills', [...values.skills, skillInput]);
                        setSkillInput('');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {values.skills.map(skill => (
                    <span key={skill} className="inline-flex items-center px-3 py-1 rounded bg-blue-100 text-blue-600 text-sm font-medium">
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue(
                            'skills',
                            values.skills.filter(s => s !== skill)
                          );
                        }}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <ErrorMessage name="skills" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Attachments (max 5MB each)</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const newFiles = Array.from(files).filter(
                        (file) => file.size <= 5 * 1024 * 1024
                      );
                      setFieldValue('attachments', [...values.attachments, ...newFiles]);
                    }
                  }}
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="mt-2">
                {values.attachments.map((file, index) => (
                  <div key={index} className="flex justify-between items-center border p-2 rounded bg-gray-50 mb-2">
                    {/* Check if the file is an image and display it accordingly */}
                    <img
                      src={file instanceof File ? URL.createObjectURL(file) : file}
                      alt={`attachment-${index}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFieldValue(
                          'attachments',
                          values.attachments.filter(f => f !== file)
                        );
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Task Description</label>
              <Field
                as="textarea"
                name="description"
                className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows={4}
                placeholder="Describe the task in detail"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Post Task
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TaskDetailForm;