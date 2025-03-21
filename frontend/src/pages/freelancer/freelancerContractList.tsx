import React from 'react';
import axiosConfig from '../../service/axios';
import ContractsList from '../../components/contracts/contractList';

interface PaymentDetails {
  amount: string;
  platformFee: string;
  netAmount: string;
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

interface Bid {
  _id: string;
  title: string;
  status: string;
}

const FreelancerContractsList: React.FC = () => {
  const processContract = (contract: RawContract) => {
    const totalMilestones = contract.milestones.length;
    const completedMilestones = contract.milestones.filter(
      m => m.status === 'completed' || m.status === 'paid'
    ).length;

    const totalEarned = contract.milestones
      .filter(m => m.status === 'completed' || m.status === 'paid')
      .reduce((sum, m) => sum + (Number(m.cost) * 0.9), 0) 
      .toString();
    const remainingAmount = (Number(contract.budget) - Number(totalEarned)).toString();

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

  const fetchContractsData = async () => {
    const userId = localStorage.getItem('userId');
    const bidResponse = await axiosConfig.get(`/users/bid/${userId}`);
    if (bidResponse.data.bid.length === 0) {
      return [];
    }
    const bidIds = bidResponse.data.bid.map((bid: Bid) => bid._id);
    
    const response = await axiosConfig.get("/users/contracts", {
      params: {
        bidIds: bidIds,
        status: 'filter'
      }
    });
    
    return response.data.contracts.map(processContract);
  };

  return (
    <ContractsList
      userType="freelancer"
      fetchDataFn={fetchContractsData}
      processContractFn={processContract}
      detailPagePath="/freelancer/freelancer-contract"
    />
  );
};

export default FreelancerContractsList;