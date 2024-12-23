import React, { useEffect, useState } from "react";
import axiosConfig from "../../service/axios";
import { useParams } from "react-router-dom";

interface TaskDetails {
  projectName: string;
  category: string;
  timeline: string;
  skills: string[];
  rateType: string;
  minRate: number | string;
  maxRate: number | string;
  description: string;
  attachments: string[];
}

const TaskDetail: React.FC = () => {
  const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const {id} = useParams<{id: string}>(); 

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axiosConfig.get(`freelancers/tasks/${id}`);
        setTaskDetails(response.data.task);
        console.log(response.data.task)
      } catch (error) {
        setError("Failed to load task details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);

  useEffect(() => {
    if (!taskDetails) return;

    const calculateTimeLeft = () => {
      const deadline = new Date(taskDetails.timeline);
      const now = new Date();
      const timeDiff = deadline.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeLeft('Task deadline reached');
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      setTimeLeft(`${days} days, ${hours} hours left`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

  }, [taskDetails]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!taskDetails) return <div>No task found</div>;

  return (
    <div className="min-h-screen text-gray-800">
      <div 
        className="w-full pt-20 h-1/2 bg-cover bg-center" 
        style={{ backgroundImage: 'url(https://img.freepik.com/premium-photo/top-view-minimal-workspace-with-laptop-glasses-coffee-cup-notebook-gray-table-copy-space-advertising-text_35674-6783.jpg?w=360)' }}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between p-6 px-32 mb-8">
          <div className="flex items-start mb-6 md:mb-0 md:w-2/3">
            <img
              src="https://via.placeholder.com/100"
              alt="Project"
              className="w-24 h-24 rounded-lg object-cover mr-4"
            />
            <div>
              <span className="text-blue-600 text-sm font-medium mb-1">
                {taskDetails.category}
              </span>
              <h1 className="text-2xl font-bold mb-2">{taskDetails.projectName}</h1>
            </div>
          </div>
  
          {/* Budget Section */}
          <div className="bg-gray-100  px-8 py-4 rounded-lg shadow-sm mt-4 md:mt-0 md:w-1/3">
            <h2 className="text-gray-500 font-medium text-sm mb-2">Budget</h2>
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
              <p className="text-gray-600 leading-relaxed mb-4">{taskDetails.description}</p>
  
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
  
              {/* Bid Card */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Bid on this job!</h2>
                <div className="mb-4">
                  <label className="text-gray-600 text-sm block mb-2">Set your minimum rate</label>
                  <input
                    type="number"
                    placeholder="$3,500"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-gray-600 text-sm block mb-2">Set your delivery time</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="w-16 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="3"
                    />
                    <select className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Days</option>
                      <option>Weeks</option>
                    </select>
                  </div>
                </div>
                <button className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700">
                  Place a Bid
                </button>
              </div>
            </div>
          </div>
  
          {/* Attachments Section */}
          <div className="p-6 px-32 mb-8">
            <h2 className="text-lg font-semibold mb-4">📎 Attachments</h2>
            <div className="flex gap-6 overflow-x-auto">
              {taskDetails.attachments.map((attachment, index) => (
                <div key={index} className="border rounded-lg shadow-sm overflow-hidden w-1/2 sm:w-1/3 md:w-1/4">
                  <img
                    src={attachment}
                    alt="Attachment"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{attachment}</h3>
                    <a href="#" className="text-blue-600 hover:underline text-sm">
                      View more &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
