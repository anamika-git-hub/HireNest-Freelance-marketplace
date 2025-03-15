import React from 'react';
import axiosConfig from '../../service/axios';
import ContractsList from '../../components/contracts/contractList';

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

interface Task {
  _id: string;
  title: string;
  status: string;
}

const ClientContractsList: React.FC = () => {
  const processContract = (contract: RawContract) => {
    const totalMilestones = contract.milestones.length;
    const completedMilestones = contract.milestones.filter(
      m => m.status === 'completed'
    ).length;

    const nextMilestone = contract.milestones.find(
      m => m.status !== 'completed'
    );

    return {
      id: contract._id,
      title: contract.title,
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

  const fetchContractsData = async () => {
    const tasksResponse = await axiosConfig.get("/client/my-tasks");
    
    if (tasksResponse.data.length === 0) {
      return [];
    }

    const taskIds = tasksResponse.data.map((task: Task) => task._id);
    const contractsResponse = await axiosConfig.get("/users/contracts", {
      params: {
        taskIds: taskIds,
        status: 'filter'
      }
    });
    
    return contractsResponse.data.contracts.map(processContract);
  };

  return (
    <ContractsList
      userType="client"
      fetchDataFn={fetchContractsData}
      processContractFn={processContract}
      detailPagePath="/client/client-contract"
    />
  );
};

export default ClientContractsList;