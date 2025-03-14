import React, { useState, useEffect } from "react";
import axiosConfig from "../../service/axios";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import toast from "react-hot-toast";
import { Formik, Form, ErrorMessage, Field } from "formik";

interface Milestone {
  title: string;
  description: string;
  dueDate: string;
  cost: string;
}

interface ContractDetail {
  title: string;
  budget: string;
  description: string;
  milestones: Milestone[];
}

const MyContract: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const initialMilestone: Milestone = {
    title: "",
    dueDate: "",
    cost: "",
    description: ""
  };

  const initialValues: ContractDetail = {
    title: "",
    budget: "",
    description: "",
    milestones: [initialMilestone],
  };

  const ContractValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    budget: Yup.string()
      .required("Budget is required")
      .test("is-number", "Budget must be a positive number", value => 
        value !== "" && !isNaN(Number(value)) && Number(value) > 0
      ),
    milestones: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string().required("Milestone title is required"),
          description: Yup.string(),
          dueDate: Yup.string(),
          cost: Yup.string()
            .required("Cost is required")
            .test("is-number", "Cost must be a positive number", value => 
              value !== "" && !isNaN(Number(value)) && Number(value) > 0
            )
        })
      )
      .test(
        "budget-milestone-match",
        "Total milestone cost must exactly match the project budget",
        function (milestones) {
          const { budget } = this.parent;
          
          if (!milestones || !budget) {
            return true; 
          }
    
          const totalMilestoneCost = milestones.reduce(
            (acc, curr) => acc + Number(curr.cost || 0),
            0
          );
          return Math.abs(totalMilestoneCost - Number(budget)) < 0.01;
        }
      )
      .min(1, "At least one milestone is required")
  });

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        const response = await axiosConfig.get(`/users/contract/${id}`);
        const contractData = response.data.result;
        
        setContract({
          title: contractData.title || "",
          description: contractData.description || "",
          budget: String(contractData.budget || ""),
          milestones: (contractData.milestones || []).map((milestone: any) => ({
            title: milestone.title || "",
            description: milestone.description || "",
            dueDate: milestone.dueDate || "",
            cost: String(milestone.cost || "")
          }))
        });
      } catch (error) {
        console.error("Error fetching contract detail", error);
        toast.error("Failed to load contract details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchContract();
    }
  }, [id]);

  const handleSubmit = async (values: ContractDetail, { setSubmitting }: any) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        budget: Number(values.budget),
        milestones: values.milestones.map(milestone => ({
          ...milestone,
          cost: Number(milestone.cost)
        }))
      };

      await axiosConfig.put(`/client/update-contract/${id}`, payload);
      toast.success("Offer submitted successfully");
    } catch (error) {
      console.error("Error submitting offer:", error);
      toast.error("Failed to submit offer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-100 py-10 px-4">
      <div className="h-[calc(100vh-6rem)] overflow-y-auto mx-auto p-10 pt-20 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Send Offer</h2>
        <p className="text-sm text-gray-600 mb-6">
          * A small percentage of the total payment will be taken as an admin commission.
        </p>
        <Formik
          initialValues={contract || initialValues}
          validationSchema={ContractValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Title</label>
                  <Field
                    type="text"
                    name="title"
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter title"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="block font-medium mb-2">Budget</label>
                  <Field
                    type="text" 
                    name="budget"
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter budget"
                  />
                  <ErrorMessage name="budget" component="div" className="text-red-600 text-sm mt-1" />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  rows={4}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project description"
                />
                <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Project Milestones</h3>
                {values.milestones.map((_, index) => (
                  <div key={index} className="border p-4 rounded-md mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                      <div>
                        <label className="block font-medium mb-1">Milestone Title</label>
                        <Field
                          type="text"
                          name={`milestones.${index}.title`}
                          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter milestone title"
                        />
                        <ErrorMessage
                          name={`milestones.${index}.title`}
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Due Date (Optional)</label>
                        <Field
                          type="date"
                          name={`milestones.${index}.dueDate`}
                          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Cost</label>
                        <Field
                          type="text" 
                          name={`milestones.${index}.cost`}
                          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter milestone cost"
                        />
                        <ErrorMessage
                          name={`milestones.${index}.cost`}
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Description</label>
                      <Field
                        as="textarea"
                        name={`milestones.${index}.description`}
                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter milestone description"
                      />
                    </div>

                    {values.milestones.length > 1 && (
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 text-sm mt-2"
                        onClick={() => {
                          const newMilestones = values.milestones.filter((_, i) => i !== index);
                          setFieldValue("milestones", newMilestones);
                        }}
                      >
                        Remove Milestone
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                  onClick={() => setFieldValue("milestones", [...values.milestones, initialMilestone])}
                >
                  Add Milestone
                </button>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Offer"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default MyContract;