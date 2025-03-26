import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axiosConfig from "../../service/axios";
import * as Yup from 'yup';
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

interface ContractFormValues {
  title: string;
  budget: string;
  description: string;
  milestones: {
    title: string;
    description: string;
    dueDate: string;
    cost: string;
  }[];
}

const ContractSection: React.FC = () => {
  const location = useLocation();
  const {bidId, taskId, freelancerId } = location.state;
  const navigate = useNavigate();
  
  const initialMilestone = { 
    title: "", 
    description: "", 
    dueDate: "", 
    cost: "", 
  };

  const ContractValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    budget: Yup.number().positive("Budget must be positive").required("Budget is required"),
    description: Yup.string().required("Description is required"),
    milestones: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required("Milestone title is required"),
        description: Yup.string(),
        dueDate: Yup.string(),
        cost: Yup.number().positive("Cost must be positive").required("Cost is required")
      })
    ).test(
      "budget-milestone-match",
      "Total milestone cost must exactly match the project budget",
      function (milestones) {
        const { budget } = this.parent;
        
        if (!milestones || !budget) {
          return false;
        }
  
        const totalMilestoneCost = milestones.reduce((acc, curr) => acc + Number(curr.cost || 0), 0);
        return totalMilestoneCost === Number(budget);
      }
    )
  });

  const handleSubmit = async (values: ContractFormValues, { setSubmitting, resetForm }: any) => {
    try {
      const formattedValues = {
        ...values,
        budget: Number(values.budget),
        milestones: values.milestones.map(milestone => ({
          ...milestone,
          cost: Number(milestone.cost)
        }))
      };
      const account = await axiosConfig.get("/users/account-detail")
      const response = await axiosConfig.post("/client/create-contract", {
        ...formattedValues,
        bidId,
        taskId,
        clientId:account.data.result.userDetails._id,
        freelancerId
      });

      if (response.status === 200) {
       navigate(`/client/my-contract/${bidId}`)
        toast.success('Offer sent successfully');
        resetForm();
      }
    } catch (error) {
        toast.error('Failed to send offer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="p-10 pt-20 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Send Offer</h2>
        <p className="text-sm text-gray-600 mb-2">
          * A small percentage of the total payment will be taken as an admin commission.
        </p>
        <Formik
          initialValues={{ 
            title: "", 
            budget: "", 
            description: "", 
            milestones: [initialMilestone] 
          }}
          validationSchema={ContractValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting , errors ,touched}) => (
            <Form>
              {/* Previous form fields remain the same */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-medium mb-2">Title</label>
                  <Field
                    type="text"
                    name="title"
                    id="title"
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Enter title"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <label className="block font-medium mb-2">Budget</label>
                  <Field
                    type="number"
                    name="budget"
                    id="budget"
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Enter budget"
                  />
                  <ErrorMessage name="budget" component="div" className="text-red-600 text-sm" />
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

              {/* Description and Milestones sections remain the same */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Project Milestones</h3>
                {typeof errors.milestones === "string" && (
                  <div className="text-red-600 text-sm mt-2">{errors.milestones}</div>
                )}

                {values.milestones.map((milestone, index) => (
                  <div key={index} className="border p-4 rounded-md mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                      <div>
                        <label className="block font-medium mb-1">Milestone Title</label>
                        <Field
                          type="text"
                          name={`milestones[${index}].title`}
                          className="w-full border border-gray-300 p-2 rounded"
                          placeholder="Enter milestone title"
                        />
                        <ErrorMessage name={`milestones[${index}].title`} component="div" className="text-red-600 text-sm" />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Due Date (Optional)</label>
                        <Field
                          type="date"
                          name={`milestones[${index}].dueDate`} 
                          className="w-full border border-gray-300 p-2 rounded"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Cost</label>
                        <Field
                          type="number"
                          name={`milestones[${index}].cost`}
                          className="w-full border border-gray-300 p-2 rounded"
                          placeholder="Enter milestone cost"
                        />
                        <ErrorMessage name={`milestones[${index}].cost`} component="div" className="text-red-600 text-sm" />

                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="block font-medium mb-1">Description</label>
                      <Field
                        as="textarea"
                        name={`milestones[${index}].description`}
                        className="w-full border border-gray-300 p-2 rounded"
                        rows={3}
                        placeholder="Enter milestone description"
                      />
                    </div>

                    {values.milestones.length > 1 && (
                      <button 
                        type="button" 
                        className="text-red-600 text-sm mt-2" 
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
                  className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
                  onClick={() => setFieldValue("milestones", [...values.milestones, initialMilestone])}
                >
                  Add Milestone
                </button>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ContractSection;