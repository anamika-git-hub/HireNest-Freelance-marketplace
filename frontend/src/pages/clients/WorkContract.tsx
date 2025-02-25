import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import axiosConfig from '../../service/axios';
import { loadStripe } from '@stripe/stripe-js';
import {Elements,PaymentElement,useStripe,useElements} from '@stripe/react-stripe-js';
import { XIcon } from 'lucide-react';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

interface Milestone {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  cost: string;
  status: 'unpaid' | 'active' | 'completed';
}

interface ContractDetail {
  _id: string;
  taskId: string;
  freelancerId: string;
  title: string;
  budget: string;
  description: string;
  milestones: Milestone[];
  status: 'ongoing' | 'completed' | 'accepted';
}

const PaymentForm: React.FC<{
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ clientSecret, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
      } else {
        toast.success('Payment successful');
        onSuccess();
      }
    } catch (err) {
      toast.error('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={isProcessing}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const PaymentModal: React.FC<{
  milestone: Milestone;
  contractId: string;
  freelancerId: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ milestone, contractId,freelancerId, onClose, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);
    useEffect(() => {
    const initializePaymentIntent = async () => {
      try {
        const response = await axiosConfig.post('/client/create-payment-intent', {
          amount: Number(milestone.cost),
          milestoneId: milestone._id,
          contractId,
          freelancerId: freelancerId,
        });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        toast.error('Failed to initialize payment');
        onClose();
      }
    };

    initializePaymentIntent();
  }, [milestone, contractId]);

  if (!clientSecret) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
        <div className="relative bg-white p-6 rounded-lg">
          <p>Initializing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Pay Milestone: {milestone.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600">Amount: ${Number(milestone.cost).toLocaleString()}</p>
          <p className="text-sm text-gray-500">
            Platform fee (10%): ${(Number(milestone.cost) * 0.1).toLocaleString()}
          </p>
        </div>

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              clientSecret={clientSecret}
              onSuccess={() => {
                onSuccess();
                onClose();
              }}
              onCancel={onClose}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};


const ClientContractDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [showMilestones, setShowMilestones] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axiosConfig.get(`/users/contract/${id}`);
        setContract(response.data.result);
      } catch (err) {
        setError('Failed to fetch contract details. Please try again later.');
        toast.error('Error loading contract details');
        console.error('Error fetching contract details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchContractDetails();
    }
  }, [id]);

  const handlePayMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
  };

  const handlePaymentSuccess = async () => {
    try {
      if(selectedMilestone){
        setContract(prev => prev ? {
          ...prev,
          milestones: prev.milestones.map(m =>
            m._id === selectedMilestone._id
              ? { ...m, status: 'active' }
              : m
          ),
        } : null);
        
        toast.success('Payment successful');
      }
      
    } catch (err) {
      toast.error('Payment failed. Please try again.');
      console.error('Error processing payment:', err);
    }
  };

  const sendMessage = () => {
    navigate('/messages');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading contract details...</div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Contract not found'}</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-100 py-4 px-4 ">
      <div className="h-[calc(100vh-6rem)] overflow-y-auto pt-20 bg-white shadow-lg rounded-lg p-6 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{contract.title}</h2>
            <p className="text-gray-500 mt-1">Contract ID: {contract._id}</p>
          </div>
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Message Freelancer
          </button>
        </div>

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
                    key={milestone._id}
                    className="border border-gray-200 rounded-lg p-4 bg-white shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900">{milestone.title}</h4>
                        <p className="text-gray-600">{milestone.description}</p>
                        <div className="mt-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                            milestone.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="md:text-right flex flex-col gap-2">
                        <p className="font-semibold text-lg text-gray-900">
                          ${Number(milestone.cost).toLocaleString()}
                        </p>
                        {milestone.dueDate && (
                          <p className="text-gray-500">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </p>
                        )}
                        {milestone.status === 'unpaid' && (
                          <button
                            onClick={() => handlePayMilestone(milestone)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                          >
                            Pay Milestone
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedMilestone && contract && (
            <PaymentModal
              milestone={selectedMilestone}
              contractId={contract._id}
              freelancerId={contract.freelancerId}
              onClose={() => setSelectedMilestone(null)}
              onSuccess={handlePaymentSuccess}
            />
          )}

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Project Terms</h3>
            <ul className="space-y-2 text-blue-700 list-disc list-inside">
              <li>Payment must be made before the freelancer begins work on each milestone</li>
              <li>Funds will be held in escrow until milestone completion</li>
              <li>All work must be original and free from plagiarism</li>
              <li>Regular updates and communication are expected</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientContractDetails;