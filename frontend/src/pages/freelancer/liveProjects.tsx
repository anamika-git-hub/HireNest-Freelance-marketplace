import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import axiosConfig from '../../service/axios';

interface PaymentDetails {
  amount: string;
  platformFee: string;
  netAmount: string;
}

interface Milestone {
  id: string;
  title: string;
  status: 'unpaid' | 'active' | 'completed' | 'paid';
  cost: string;
  dueDate: string;
  paymentDetails?: PaymentDetails;
}

interface RawContract {
  _id: string;
  title: string;
  clientId: string;
  clientName: string;
  budget: string;
  status: 'ongoing' | 'completed' | 'accepted';
  milestones: Array<{
    title: string;
    cost: string;
    status: 'unpaid' | 'active' | 'completed' | 'paid';
    dueDate: string;
    _id: string;
    paymentDetails?: PaymentDetails;
  }>;
  startDate: string;
}

interface ProcessedContract {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  budget: string;
  status: 'ongoing' | 'completed';
  nextMilestone?: Milestone;
  completedMilestones: number;
  totalMilestones: number;
  startDate: string;
  totalEarned: string;
  remainingAmount: string;
}

interface Bid {
  _id: string;
  title: string;
  status: string;
}

const FreelancerContractsList: React.FC = () => {
  const [contracts, setContracts] = useState<ProcessedContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const processContract = (contract: RawContract): ProcessedContract => {
    const totalMilestones = contract.milestones.length;
    const completedMilestones = contract.milestones.filter(
      m => m.status === 'completed' || m.status === 'paid'
    ).length;

    // Calculate total earned from completed/paid milestones
    const totalEarned = contract.milestones
      .filter(m => m.status === 'completed' || m.status === 'paid')
      .reduce((sum, m) => sum + (Number(m.cost) * 0.9), 0) // Assuming 10% platform fee
      .toString();
    // Calculate remaining amount
    const remainingAmount = (Number(contract.budget) - Number(totalEarned)).toString();

    // Find the next milestone (first non-completed/non-paid milestone)
    const nextMilestone = contract.milestones.find(
      m => m.status !== 'completed' && m.status !== 'paid'
    );

    return {
      id: contract._id,
      title: contract.title,
      clientId: contract.clientId,
      clientName: contract.clientName,
      budget: contract.budget,
      status: contract.status === 'accepted' ? 'ongoing' : contract.status,
      nextMilestone: nextMilestone ? {
        id: nextMilestone._id,
        title: nextMilestone.title,
        status: nextMilestone.status,
        cost: nextMilestone.cost,
        dueDate: nextMilestone.dueDate,
        paymentDetails: nextMilestone.paymentDetails
      } : undefined,
      completedMilestones,
      totalMilestones,
      startDate: contract.startDate,
      totalEarned,
      remainingAmount
    };
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const fetchContractsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const bidResponse = await axiosConfig.get(`/users/bid/${userId}`);
        const bidIds = bidResponse.data.bid.map((bid:Bid) => bid._id);
        const response =await axiosConfig.get("/users/contracts", {
          params: {
            bidIds: bidIds,
            status: 'accepted'
          }
        });
        const processedContracts = response.data.contracts.map(processContract);
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
    navigate(`/freelancer/freelancer-contract/${contractId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-600">Loading contracts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Active Contracts</h1>
          </div>
        </div>

        <div className="space-y-4">
          {contracts.map(contract => (
            <div
              key={contract.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleContractClick(contract.id)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {contract.title}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Started: {new Date(contract.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      ${Number(contract.budget).toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600 font-medium mt-1">
                      Earned: ${Number(contract.totalEarned).toLocaleString()}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                      contract.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                    </span>
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
                      <div className="text-right mr-2">
                        <p className="font-medium text-gray-900">
                          ${Number(contract.nextMilestone.cost).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Net: ${(Number(contract.nextMilestone.cost) * 0.9).toLocaleString()}
                        </p>
                      </div>
                      <FaChevronRight className="text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {contracts.length === 0 && (
            <p className="text-center text-gray-600 py-8">No active contracts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerContractsList;