import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosConfig from '../../service/axios';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmMessage from '../../components/shared/ConfirmMessage';
import { FaChevronDown } from 'react-icons/fa';

interface Milestone {
  title: string;
  description: string;
  dueDate: string;
  cost: string;
}

interface ContractDetail {
  _id?: string;
  taskId: string;
  bidId: string;
  title: string;
  budget: string;
  description: string;
  milestones: Milestone[];
  status?: 'pending' | 'accepted' | 'rejected';  
}

interface ConfirmAction {
  bidId: string;
  action: 'accept' | 'reject';
  taskId: string;
}

const ContractDetails: React.FC = () => {
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [showMilestones, setShowMilestones] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const { id } = useParams<{ id: string }>();
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContract = async() => {
      const response = await axiosConfig.get(`/users/contract/${id}`);
      setContract(response.data.result);
    }

    fetchContract();
  }, [id]);

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    const { bidId, action, taskId } = confirmAction;
    try {
      const response = await axiosConfig.patch(`/freelancers/contract-status/${bidId}`, {
        status: action === 'accept' ? 'accepted' : 'rejected',
        taskId
      });
      if(response.status === 200) {
        toast.success(`Contract ${action}ed successfully`);
        setContract(prev => prev ? {...prev, status: action === 'accept' ? 'accepted' : 'rejected'} : null);
      }
    } catch (error) {
      toast.error('Failed to update contract status');
    } finally {
      setConfirmAction(null);
    }
  };

  const sendMessage = async(taskId: string) => {
    const taskResponse = await axiosConfig.get(`/users/tasks/${taskId}`);
    await axiosConfig.post('/users/set-contacts', {
      senderId: userId,
      receiverId: taskResponse.data.task.clientId,
      role
    });
    navigate(`/messages`);
  };

  if (!contract) return <div>No Contract found</div>;
  
  return (
    <div className=" bg-gray-100 py-4 px-4">
        {confirmAction && (
          <ConfirmMessage
            message={`Are you sure you want to ${confirmAction.action} this contract?`}
            onConfirm={handleConfirmAction}
            onCancel={() => setConfirmAction(null)}
          />
        )}

        <div className="h-[calc(100vh-6rem)] overflow-y-auto pt-20 bg-white shadow-lg rounded-lg p-6 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{contract.title}</h2>
              <p className="text-gray-500 mt-1">Contract ID: {contract._id?.toLocaleUpperCase().slice(-6)}</p>
              {contract.status === 'rejected' && (
                <p className="text-red-500 font-semibold mt-2">Status: This contract is rejected by you</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={() => sendMessage(contract.taskId)}
              >
                Message Client
              </button>
              
              {contract.status === 'pending' && (
                <>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => setConfirmAction({
                      bidId: contract.bidId,
                      action: 'accept',
                      taskId: contract.taskId
                    })}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => setConfirmAction({
                      bidId: contract.bidId,
                      action: 'reject',
                      taskId: contract.taskId
                    })}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Rest of the JSX remains the same */}
          <div className="mt-8 space-y-6">
            <div className="text-xl font-semibold text-green-600">
              Total Budget: ${Number(contract.budget).toLocaleString()}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Project Description</h3>
              <p className="text-gray-700 mt-2 leading-relaxed">{contract.description}</p>
            </div>

            <div>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setShowMilestones(!showMilestones)}
              >
                <span className="text-lg mr-2 font-semibold text-gray-900">Project Milestones</span>
                <FaChevronDown className={`transition-transform duration-200 mt-1 ${showMilestones ? 'rotate-180' : ''}`} />
              </div>

              {showMilestones && (
                <div className="space-y-4 mt-4">
                  {contract.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 bg-white shadow"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{milestone.title}</h4>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                        <div className="md:text-right">
                          <p className="font-semibold text-lg text-gray-900">
                            ${Number(milestone.cost).toLocaleString()}
                          </p>
                          {milestone.dueDate && (
                            <p className="text-gray-500 mt-2">
                              Due Date: {new Date(milestone.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Project Terms</h3>
              <ul className="space-y-2 text-blue-700 list-disc list-inside">
                <li>Payment will be released after completion of each milestone</li>
                <li>All work must be original and free from plagiarism</li>
                <li>Regular updates and communication are expected</li>
                <li>A service fee will be deducted from the total payment</li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ContractDetails;