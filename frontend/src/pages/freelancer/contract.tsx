import React,{useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import axiosConfig from '../../service/axios';
import { useParams } from 'react-router-dom';

interface Milestone {
  title: string;
  description: string;
  dueDate: string;
  cost: string;
}

interface ContractDetail {
  id?:string;
  title: string;
  budget: string;
  description: string;
  milestones: Milestone[];
}

const ContractDetails:React.FC = () => {
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [showMilestones, setShowMilestones] = useState(false);
   const { id } = useParams<{ id: string }>();
   console.log('id',id)

  useEffect(()=> {
   const fetchContract= async() => {
    const response = await axiosConfig.get(`/users/contract/${id}`)
      setContract(response.data.result);
   }

   fetchContract();
  },[id])
  

  const handleAccept = async() => {
    if(!contract){
      return
    }
    const response = await axiosConfig.post(`/freelancer/accept-contract/${contract.id}`);
    if(response.status === 200){
        toast.success('Contract accept successfully')
    }
    
  };

  const handleReject = () => {
    console.log('Contract rejected');
  };

  const handleMessage = () => {
    console.log('Navigate to messages');
  };
  if (!contract) return <div>No Contract found</div>;
  return (
    <div className=" min-h-screen bg-gray-100 py-4 px-4">
        <div className="min-h-screen pt-20 bg-white shadow-lg rounded-lg p-6 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{contract.title}</h2>
              <p className="text-gray-500 mt-1">Contract ID: {contract.id}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={handleMessage}
              >
                Message Client
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                onClick={handleAccept}
              >
                Accept
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {/* Budget Section */}
            <div className="text-xl font-semibold text-green-600">
              Total Budget: ${Number(contract.budget).toLocaleString()}
            </div>

            {/* Description Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Project Description</h3>
              <p className="text-gray-700 mt-2 leading-relaxed">{contract.description}</p>
            </div>

            {/* Milestones Section */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowMilestones(!showMilestones)}
            >
              <h3 className="text-lg font-semibold text-gray-900">Project Milestones</h3>
              <span className="text-xl text-gray-900">
                {showMilestones ? 'ᐱ' : 'ᐯ'}
              </span>
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

            {/* Project Terms */}
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