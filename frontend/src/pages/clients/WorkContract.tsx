import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronDown, FaFileDownload } from 'react-icons/fa';
import axiosConfig from '../../service/axios';
import { loadStripe } from '@stripe/stripe-js';
import {Elements,PaymentElement,useStripe,useElements} from '@stripe/react-stripe-js';
import { XIcon ,FileIcon,CheckCircle,XCircle} from 'lucide-react';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

interface MilestoneFile {
  fileName: string;
  fileUrl: string;
}

interface Milestone {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  cost: string;
  status: 'unpaid' | 'active' | 'completed' | 'review' | 'accepted' | 'rejected';
  completionDetails?: {
    description: string;
    files: MilestoneFile[];
    submittedAt: string;
  };
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
      console.log('fffrrrr',freelancerId)
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


const MilestoneDetailsModal: React.FC<{
  milestone: Milestone;
  onClose: () => void;
  onAccept: () => void;
  onReject: (reason: string) => void;
}> = ({ milestone, onClose, onAccept, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectForm,setShowRejectForm] = useState<boolean>(false);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleRejectClick = () => {
    setShowRejectForm(true);
  };

  const handleCancelReject = () => {
    setShowRejectForm(false);
    setRejectionReason('');
  };

  const handleSubmitRejection = () => {
    onReject(rejectionReason);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Milestone Submission: {milestone.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        {milestone.completionDetails ? (
          <div className="mb-6 space-y-4">
            <div>
              <h4 className="text-lg font-medium">Description</h4>
              <p className="text-gray-700 mt-1">{milestone.completionDetails.description}</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium">Submitted Files</h4>
              {milestone.completionDetails.files && milestone.completionDetails.files.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {milestone.completionDetails.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <FileIcon className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="text-gray-700">{file.fileName}</span>
                      </div>
                      <a 
                        href={file.fileUrl} 
                        download
                        className="text-blue-500 hover:text-blue-700 flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFileDownload className="mr-1" /> Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-1">No files submitted</p>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              Submitted on: {new Date(milestone.completionDetails.submittedAt).toLocaleString()}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No completion details available</p>
        )}
        
        {milestone.status === 'review' && !showRejectForm && (
          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={onAccept}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-1" /> Accept & Release Payment
            </button>
            <button
              onClick={handleRejectClick}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <XCircle className="w-5 h-5 mr-1" /> Reject
            </button>
          </div>
        )}
        {showRejectForm && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-lg font-medium mb-2">Provide Rejection Reason</h4>
            <p className="text-sm text-gray-600 mb-3">Please explain why you're rejecting this milestone to help the freelancer understand what needs improvement.</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Enter your reason for rejection..."
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={handleCancelReject}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRejection}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                disabled={!rejectionReason.trim()}
              >
                Submit Rejection
              </button>
            </div>
          </div>
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
  const [viewMilestone, setViewMilestone] = useState<Milestone | null>(null);
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

  const handleViewMilestone = (milestone: Milestone) => {
    setViewMilestone(milestone);
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
  const handleAcceptMilestone = async () => {
    if (!viewMilestone || !contract) return;
    
    try {
      await axiosConfig.post(`/client/accept-milestone`, {
        milestoneId: viewMilestone._id,
        contractId: contract._id,
      });
      
      toast.success('Milestone accepted and payment released');
      
      // Update the contract state
      setContract(prev => prev ? {
        ...prev,
        milestones: prev.milestones.map(m =>
          m._id === viewMilestone._id
            ? { ...m, status: 'accepted' }
            : m
        ),
      } : null);
      
      setViewMilestone(null);
      
      // Check if all milestones are completed or accepted
      const updatedMilestones = contract.milestones.map(m => 
        m._id === viewMilestone._id ? { ...m, status: 'accepted' } : m
      );
      
      const allCompleted = updatedMilestones.every(
        m => m.status === 'accepted' || m.status === 'completed'
      );
      
      if (allCompleted) {
        // Update contract status to completed
        await axiosConfig.post(`/client/complete-contract`, {
          contractId: contract._id,
        });
        
        toast.success('All milestones completed. Contract marked as completed.');
        setContract(prev => prev ? { ...prev, status: 'completed' } : null);
      }
      
    } catch (err) {
      toast.error('Failed to accept milestone');
      console.error('Error accepting milestone:', err);
    }
  };

  const handleRejectMilestone = async (rejectionReason: string) => {
    if (!viewMilestone || !contract) return;
    
    try {
      await axiosConfig.post(`/client/reject-milestone`, {
        milestoneId: viewMilestone._id,
        contractId: contract._id,
        rejectionReason: rejectionReason
      });
      
      toast.success('Milestone rejected and sent back to freelancer');
      
      // Update the contract state
      setContract(prev => prev ? {
        ...prev,
        milestones: prev.milestones.map(m =>
          m._id === viewMilestone._id
            ? { ...m, status: 'active' }
            : m
        ),
      } : null);
      
      setViewMilestone(null);
      
    } catch (err) {
      toast.error('Failed to reject milestone');
      console.error('Error rejecting milestone:', err);
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

  console.log('cccc',contract)

  return (
    <div className="h-full bg-gray-100 py-4 px-4 ">
      <div className="h-[calc(100vh-6rem)] overflow-y-auto pt-20 bg-white shadow-lg rounded-lg p-6 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{contract.title}</h2>
            <p className="text-gray-500 mt-1">Contract ID: {contract._id}</p>
            <div className="mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                contract.status === 'completed' ? 'bg-green-100 text-green-800' :
                contract.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
              </span>
            </div>
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
                {contract.milestones.map((milestone) => (
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
                           milestone.status === 'accepted' ? 'bg-green-100 text-green-800' :
                           milestone.status === 'review' ? 'bg-purple-100 text-purple-800' :
                           milestone.status === 'active' ? 'bg-blue-100 text-blue-800' :
                           milestone.status === 'rejected' ? 'bg-red-100 text-red-800' :
                           milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                           'bg-gray-100 text-gray-800'
                          }`}>
                             {milestone.status === 'review' ? 'Awaiting Review' : 
                             milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
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
                         {milestone.status === 'review' && (
                          <button
                            onClick={() => handleViewMilestone(milestone)}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
                          >
                            Review Submission
                          </button>
                        )}
                        
                        {(milestone.status === 'accepted' || milestone.status === 'completed') && milestone.completionDetails && (
                          <button
                            onClick={() => handleViewMilestone(milestone)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                          >
                            View Submission
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
           {viewMilestone && (
            <MilestoneDetailsModal
              milestone={viewMilestone}
              onClose={() => setViewMilestone(null)}
              onAccept={handleAcceptMilestone}
              onReject={handleRejectMilestone}
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