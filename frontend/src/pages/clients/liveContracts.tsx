import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import axiosConfig from '../../service/axios';

interface Milestone {
  id: string;
  title: string;
  status: 'unpaid' | 'active' | 'completed';
  cost: string;
  dueDate: string;
}

interface RawContract {
  _id: string;
  taskId: string;
  title: string;
  freelancerId: string;
  budget: string;
  status: 'ongoing' | 'completed' | 'accepted';
  milestones: Array<{
    title: string;
    cost: string;
    status: 'unpaid' | 'active' | 'completed';
    dueDate: string;
    _id: string;
  }>;
  startDate: string;
}

interface ProcessedContract {
  _id: string;
  taskId: string;
  title: string;
  freelancerId: string;
  budget: string;
  status: 'ongoing' | 'completed';
  nextMilestone?: Milestone;
  completedMilestones: number;
  totalMilestones: number;
  startDate: string;
}

interface Task {
  _id: string;
  title: string;
  status: string;
}

const ClientContractsList: React.FC = () => {
  const [contracts, setContracts] = useState<ProcessedContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const processContract = (contract: RawContract): ProcessedContract => {
    const totalMilestones = contract.milestones.length;
    const completedMilestones = contract.milestones.filter(
      m => m.status === 'completed'
    ).length;

    // Find the next milestone (first non-completed milestone)
    const nextMilestone = contract.milestones.find(
      m => m.status !== 'completed'
    );

    return {
      _id: contract._id,
      taskId: contract.taskId,
      title: contract.title,
      freelancerId: contract.freelancerId,
      budget: contract.budget,
      status: contract.status === 'accepted' ? 'ongoing' : contract.status,
      nextMilestone: nextMilestone ? {
        id: nextMilestone._id,
        title: nextMilestone.title,
        status: nextMilestone.status,
        cost: nextMilestone.cost,
        dueDate: nextMilestone.dueDate,
      } : undefined,
      completedMilestones,
      totalMilestones,
      startDate: contract.startDate
    };
  };

  useEffect(() => {
    const fetchContractsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const tasksResponse = await axiosConfig.get("/client/my-tasks");
        const ongoingTasks = tasksResponse.data.filter((task: Task) => 
          task.status === 'ongoing'
        );
        
        if (ongoingTasks.length === 0) {
          setContracts([]);
          setIsLoading(false);
          return;
        }

        const taskIds = ongoingTasks.map((task: Task) => task._id);
        const contractsResponse = await axiosConfig.get("/users/contracts", {
          params: {
            taskIds: taskIds,
            status: 'ongoing'
          }
        });
        const processedContracts = contractsResponse.data.contracts.map(processContract);
        setContracts(processedContracts);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch contracts. Please try again later.');
        setIsLoading(false);
        console.error('Error fetching contracts:', err);
      }
    };

    fetchContractsData();
  }, []);

  const getProgressColor = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    if (percentage < 33) return 'bg-blue-500';
    if (percentage < 66) return 'bg-blue-600';
    return 'bg-blue-700';
  };

  const handleContractClick = (contractId: string) => {
    navigate(`/client/client-contract/${contractId}`);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Active Contracts</h1>
        </div>
        <div className="space-y-4">
          {contracts.map(contract => (
            <div
              key={contract._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleContractClick(contract._id)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {contract.title}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Started: {new Date(contract.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      ${Number(contract.budget).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progress: {contract.completedMilestones} of {contract.totalMilestones} milestones
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round((contract.completedMilestones / contract.totalMilestones) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(contract.completedMilestones, contract.totalMilestones)}`}
                      style={{ width: `${(contract.completedMilestones / contract.totalMilestones) * 100}%` }}
                    />
                  </div>
                </div>

                {contract.nextMilestone && (
                  <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Next Milestone:</p>
                      <p className="text-gray-900">{contract.nextMilestone.title}</p>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(contract.nextMilestone.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 mr-2">
                        ${Number(contract.nextMilestone.cost).toLocaleString()}
                      </span>
                      <FaChevronRight className="text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientContractsList;