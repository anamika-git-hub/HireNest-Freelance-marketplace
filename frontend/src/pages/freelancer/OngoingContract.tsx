import React, { useState,useEffect,useRef} from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronDown, FaUpload } from 'react-icons/fa';
import { XIcon } from 'lucide-react';
import axiosConfig from '../../service/axios';

interface PaymentDetails {
  id: string;
  amount: string;
  paymentDate: string;
  transactionId: string;
  platformFee: string;
  netAmount: string;
}

interface SubmissionDetails {
  description: string;
  fileUrl: string;
  fileName: string;
  submittedAt: string;
};

interface Milestone {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  cost: string;
  status: 'unpaid' | 'active' | 'review' | 'rejected' | 'completed';
  paymentDetails?: PaymentDetails;
  submissionDetails?: SubmissionDetails;
  completionDetails?:SubmissionDetails;
  rejectionReason?: string;
}

interface ContractDetail {
  _id: string;
  taskId: string;
  clientId: {
    firstname:string;
    lastname:string};
  freelancerId: string;
  title: string;
  budget: string;
  description: string;
  milestones: Milestone[];
  status: 'ongoing' | 'completed';
}

const CompletionModal: React.FC<{
  milestone: Milestone;
  onClose: () => void;
  onSubmit: (milestoneId: string, description: string, file: File | null) => Promise<void>;
}> = ({ milestone, onClose, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please provide a description of your work');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(milestone._id, description, file);
      onClose();
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Submit Milestone: {milestone.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Work Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Describe the work you've completed..."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Files (Optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center"
              >
                <FaUpload className="mr-2" /> Choose File
              </button>
              <span className="ml-3 text-sm text-gray-500">
                {file ? file.name : 'No file selected'}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FreelancerContractDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [showMilestones, setShowMilestones] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null);
  const [completionModal,setCompletionModal] = useState<Milestone | null>(null);
  const [isLoading,setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axiosConfig.get(`/users/contract/${id}`);
        console.log('ressp',response)
        setContract(response.data.result);
      } catch (error) {
        setError(`Failed to fetch contract details.Please try again later.`);
        toast.error('Error loading contract details');
      } finally {
        setIsLoading(false);
      }
    };

    if(id) {
      fetchContractDetails();
    }
  },[id]);

  const handleMarkCompleted = (milestone: Milestone) => {
    setCompletionModal(milestone);
  };

  const handleSubmitCompletion = async (milestoneId: string, description: string, file: File | null) => {
    try {

      const formData = new FormData();
      formData.append('contractId', id || '');
      formData.append('milestoneId', milestoneId);
      formData.append('description', description);
      if(file){
        formData.append('file',file);
      }
      const response = await axiosConfig.post('/freelancers/submit-milestone',formData,{
        headers: {
          'Content-Type' : 'multipart/form-data',
        },
      });
      if(response.status === 200){
        setContract(prev => prev?{
          ...prev,
          milestones: prev.milestones.map(milestone =>
            milestone._id === milestoneId
              ? { ...milestone, 
                status: 'review',
                submissionDetails: {
                  description,
                  fileUrl: file? URL.createObjectURL(file) : '',
                  fileName: file ? file.name : '',
                  submittedAt: new Date().toISOString()
                }
               }
              : milestone
          ),
        }: null);
        toast.success('Milestone marked as completed');
       
      }
     } catch (error) {
        toast.error('Failed to submit milestone.please try again later')
    }
  
  };
  const downloadInvoice = (paymentId: string) => {
    // Demo function - would generate and download invoice in real implementation
    toast.success('Downloading invoice...');
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
    <div className="min-h-screen bg-gray-100 py-4 px-4">
      <div className="h-screen overflow-y-auto pt-20 bg-white shadow-lg rounded-lg p-6 mx-auto">
        {/* Payment Details Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Payment Details</h3>
              <div className="space-y-3">
                <p><span className="font-medium">Amount:</span> ${Number(selectedPayment.amount).toLocaleString()}</p>
                <p><span className="font-medium">Payment Date:</span> {new Date(selectedPayment.paymentDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Transaction ID:</span> {selectedPayment.transactionId}</p>
                <p><span className="font-medium">Platform Fee:</span> ${Number(selectedPayment.platformFee).toLocaleString()}</p>
                <p><span className="font-medium">Net Amount:</span> ${Number(selectedPayment.netAmount).toLocaleString()}</p>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => downloadInvoice(selectedPayment.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Download Invoice
                  </button>
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

            {/* Completion Modal */}
            {completionModal && (
              <CompletionModal
                milestone={completionModal}
                onClose={() => setCompletionModal(null)}
                onSubmit={handleSubmitCompletion}
              />
            )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{contract.title}</h2>
            <p className="text-gray-500 mt-1">Contract ID: {contract._id}</p>
            <p className="text-gray-600">Client: {contract.clientId.firstname} {contract.clientId.lastname}</p>
          </div>
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Message Client
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
                    className={`border border-gray-200 rounded-lg p-4 bg-white shadow ${
                      milestone.status === 'unpaid' ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900">{milestone.title}</h4>
                        <p className="text-gray-600">{milestone.description}</p>
                        <div className="mt-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                            milestone.status === 'review' ? 'bg-purple-100 text-purple-800' :
                            milestone.status === 'rejected' ? 'bg-red-100 text-red-100' :
                            milestone.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {milestone.status === 'review' ? 'Pending Approval' :
                            milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                          </span>
                        </div>
                        {milestone.status === 'rejected' && milestone.rejectionReason && (
                          <div className="mt-2 text-red-600 text-sm">
                            <p><strong>Rejection reason:</strong> {milestone.rejectionReason}</p>
                          </div>
                        )}
                        {milestone.status === 'review' && milestone.completionDetails && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p><strong>Submitted:</strong> {new Date(milestone.completionDetails.submittedAt).toLocaleString()}</p>
                            <p><strong>Description:</strong> {milestone.completionDetails.description}</p>
                            {milestone.completionDetails.fileName && (
                              <p><strong>File:</strong> {milestone.completionDetails.fileName}</p>
                            )}
                          </div>
                        )}
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
                        <div className="flex flex-col gap-2">
                          {milestone.status === 'active' && (
                            <button
                              onClick={() => handleMarkCompleted(milestone)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                              Mark as Completed
                            </button>
                          )}
                          
                          {milestone.status === 'completed' && (
                            <button
                              onClick={() => setSelectedPayment(milestone.paymentDetails!)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                            >
                              View Payment
                            </button>
                          )}
                        </div>
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
              <li>Work can only begin after client payment for each milestone</li>
              <li>Platform fee of 10% will be deducted from each payment</li>
              <li>All work must be original and free from plagiarism</li>
              <li>Regular updates and communication are expected</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerContractDetails;