import React, { useEffect, useState} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BidValidationSchema } from "../../components/Schemas/bidValidationSchema";
import * as Yup from 'yup'; 
import { FaRegBookmark, FaCopy, FaShareAlt } from "react-icons/fa";
import axiosConfig from "../../service/axios";
import { useParams } from "react-router-dom";
import Loader from "../../components/shared/Loader";
import toast from "react-hot-toast";

interface TaskDetails {
  projectName: string;
  category: string;
  timeline: string;
  skills: string[];
  rateType: string;
  minRate: number ;
  maxRate: number ;
  description: string;
  attachments: string[];
}

interface BidFormValues {
  rate: number;
  deliveryTime: number;
  timeUnit: string;
}

interface ExistingBid {
  rate: number;
  deliveryTime: number;
  timeUnit: string;
  createdAt: string;
}

interface BidFormData extends BidFormValues {
  taskId?: { _id: string };
}

type ValidationSchemaType = Yup.ObjectSchema<BidFormValues>;

const TaskDetail: React.FC = () => {
  const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [validationSchema, setValidationSchema] = useState<ValidationSchemaType | null>(null);
  const [existingBid, setExistingBid] = useState<ExistingBid | null>(null);

  const { id } = useParams<{ id: string }>();
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axiosConfig.get(`/users/tasks/${id}`);
        setTaskDetails(response.data.task);

        const schema = BidValidationSchema({
          minRate: response.data.task.minRate,
          maxRate: response.data.task.maxRate
        });
        setValidationSchema(schema);

        const bidResponse = await axiosConfig.get(`/users/bid/${userId}`);
        const existingBidForTask = bidResponse.data.bid.find((bid: BidFormData) => bid.taskId?._id === id);
        
        if (existingBidForTask) {
          setExistingBid({
            rate: existingBidForTask.rate,
            deliveryTime: existingBidForTask.deliveryTime,
            timeUnit: existingBidForTask.timeUnit,
            createdAt: existingBidForTask.createdAt
          });
        }
      } catch (error) {
        setError("Failed to load task details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id,userId]);

  useEffect(() => {
    if (!taskDetails) return;

    const calculateTimeLeft = () => {
      const deadline = new Date(taskDetails.timeline);
      const now = new Date();
      const timeDiff = deadline.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeLeft("Task deadline reached");
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      setTimeLeft(`${days} days, ${hours} hours left`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [taskDetails]);

  const handleSubmit = async (values: BidFormValues, { setSubmitting, resetForm }: any) => {
    try {
    
    await axiosConfig.post(`/freelancers/create-bid`, {
      ...values, 
      taskId: id, 
      bidderId: userId
    });
    
    toast.success("Bid placed successfully!");
    resetForm();

    setExistingBid({
      ...values,
      createdAt: new Date().toISOString()
    });
      
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = () => {
    toast('Sharing functionality coming soon!', {
      style: {
        background: '#2196F3', 
        color: '#fff', 
      },
    });
  };
  

  if (loading)  return <Loader visible={loading} />;
  if (error) return <div>{error}</div>;

  if (!taskDetails || !validationSchema) return <div>No task found</div>;

  const initialValues = {
    rate: taskDetails.minRate,
    deliveryTime: Math.max(1, Math.floor((new Date(taskDetails.timeline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))),
    timeUnit: "Days",
  };

  return (
    <div className="min-h-screen text-gray-800">
      <div
        className="w-full pt-20 h-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://img.freepik.com/premium-photo/top-view-minimal-workspace-with-laptop-glasses-coffee-cup-notebook-gray-table-copy-space-advertising-text_35674-6783.jpg?w=360)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between p-6 px-32 mb-8">
          <div className="flex items-start mb-6 md:mb-0 md:w-2/3">
           
            <div>
              <span className="text-blue-600 text-sm font-medium mb-1">
                {taskDetails.category}
              </span>
              <h1 className="text-2xl font-bold mb-2">
                {taskDetails.projectName}
              </h1>
            </div>
          </div>

          {/* Budget Section */}
          <div className="bg-gray-100  px-8 py-4 rounded-lg shadow-sm mt-4 md:mt-0 md:w-1/3">
            <h2 className="text-gray-500 font-medium text-sm mb-2">
              Budget ({taskDetails.rateType})
            </h2>
            <p className="text-xl font-semibold text-green-500">
              ${taskDetails.minRate} – ${taskDetails.maxRate}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full h-1/2 bg-white">
        <div className="w-full mx-auto px-4 py-8">
          {/* Work Description & Required Skills */}
          <div className="p-6 px-32 mb-8 flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-blue-600 mr-2">ℹ️</span> Work Description
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {taskDetails.description}
              </p>

              <h2 className="text-lg font-semibold mb-4 flex items-center mt-6">
                <span className="mr-2">✅</span> Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {taskDetails.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Section: Time Left */}
            <div className="md:w-1/3">
              <div className="bg-green-100 text-green-600 px-6 py-4 rounded-lg flex items-center justify-center shadow-sm mb-6">
                <p className="text-lg font-semibold">{timeLeft}</p>
              </div>
              {/* Existing Bid Section */}
              {existingBid ? (
                <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-lg font-semibold mb-4 text-blue-700">Your Bid Details</h2>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Rate:</span> ${existingBid.rate}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Delivery Time:</span> {existingBid.deliveryTime} {existingBid.timeUnit}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Bid Placed:</span> {new Date(existingBid.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 text-sm text-blue-600">
                    You have already placed a bid on this task.
                  </div>
                </div>
              ) : (
              <Formik
               initialValues={initialValues}
               validationSchema={validationSchema}
               onSubmit={handleSubmit}
               enableReinitialize
               >
                {({isSubmitting, errors, touched}) => (

                
              <Form
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-lg font-semibold mb-4">Bid on this job!</h2>
                <div className="mb-4">
                  <label className="text-gray-600 text-sm block mb-2">
                    Set your minimum rate
                  </label>
                  <Field
                    type="number"
                    name="rate"
                    placeholder="Enter the rate"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none 
                      ${errors.rate && touched.rate 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'focus:ring-2 focus:ring-blue-500'}`}
                  />
                  <ErrorMessage 
                    name="rate" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>
                <div className="mb-4">
                  <label className="text-gray-600 text-sm block mb-2">
                    Set your delivery time
                  </label>
                  <div className="flex gap-2">
                  <Field
                    type="number"
                    name="deliveryTime"
                    className={`w-16 px-2 py-2 border rounded-lg focus:outline-none 
                      ${errors.deliveryTime && touched.deliveryTime 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'focus:ring-2 focus:ring-blue-500'}`}
                    placeholder="3"
                  />
                    <Field
                    as="select"
                    name="timeUnit"
                    className={`border px-4 py-2 rounded-lg 
                      ${errors.timeUnit && touched.timeUnit 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'focus:ring-2 focus:ring-blue-500'}`}
                  >
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                  </Field>
                  </div>
                  {errors.deliveryTime && touched.deliveryTime && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.deliveryTime}
                  </div>
                )}
                {errors.timeUnit && touched.timeUnit && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.timeUnit}
                  </div>
                )}
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
                >
                  {isSubmitting ? 'Placing Bid...' : 'Place a Bid'}
                </button>
              </Form>
              )}
              </Formik>
              )}
              
              {/* Bookmark, Copy, and Share Section */}
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md mt-6">
            <button
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              onClick={() => toast.success("Task bookmarked!")}
            >
              <FaRegBookmark className="text-lg" />
              <span>Bookmark</span>
            </button>
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              onClick={handleCopyLink}
            >
              <FaCopy className="text-lg" />
              <span>Copy Link</span>
            </button>
            <button
              className="flex items-center gap-2 text-green-600 hover:text-green-700"
              onClick={handleShare}
            >
              <FaShareAlt className="text-lg" />
              <span>Share It!</span>
            </button>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
