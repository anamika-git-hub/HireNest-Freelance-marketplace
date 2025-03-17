import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axiosConfig from "../../service/axios";
import Loader from "../../components/shared/Loader";
import toast from "react-hot-toast";
import ConfirmMessage from "../../components/shared/ConfirmMessage";

interface Bid {
  _id: string; 
  rate: string;
  deliveryTime: number;
  taskId: string;
  timeUnit: string;
  bidderId: string;
  contractStatus: 'pending' | 'accepted' | 'rejected'; 
  status: 'pending' | 'accepted' | 'rejected'; 
}

interface BidderProfile {
  _id: string;
  name: string;
  profileImage: string | null;
  tagline: string;
}

interface ConfirmAction {
  bidId: string;
  action: 'accept' | 'reject';
  freelancerId?: string;
}

const BiddersList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [freelancerProfiles, setFreelancerProfiles] = useState<BidderProfile[]>([]);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  const fetchBids = async () => {
    try {
      const response = await axiosConfig.get(`/client/task-bids/${id}`);
      const fetchedBidders = response.data.bids;
      const fetchedProfiles = await Promise.all(
        fetchedBidders.map(async (bidder: Bid) => {
          const freelancerProfileResponse = await axiosConfig.get(
            `/users/freelancer-profile/${bidder.bidderId}`
          );
          return freelancerProfileResponse.data;
        })
      );

      const bidsWithContractStatus = await Promise.all(
        fetchedBidders.map(async (bid:Bid) => {
          if (bid.status === 'accepted') {
            try {
              const contractResponse = await axiosConfig.get(`/users/contract/${bid._id}`);
              return { ...bid, contractStatus: contractResponse.data.result.status };
            } catch {
              return { ...bid, contractStatus: null };
            }
          }
          return { ...bid, contractStatus: null };
        })
      );

      setFreelancerProfiles(fetchedProfiles);
      setBids(bidsWithContractStatus);
      setLoading(false);
    } catch (err) {
      setError("Failed to load bidders. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBids();
    }
  }, [id]);

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    const { bidId, action, freelancerId } = confirmAction;
    try {
      setLoading(true);

      if (action === 'accept' && id) {
        const taskResponse = await axiosConfig.get(`/users/tasks/${id}`);
        const taskStatus = taskResponse.data.task.status;

        if (taskStatus !== 'pending') {
          toast.error("This task is currently on hold and cannot be accepted.");
          setLoading(false);
          return;
        }
      }

      const response = await axiosConfig.patch(`/client/bid-status/${bidId}`, {
        status: action === 'accept' ? 'accepted' : 'rejected',
        taskId: id
      });

      if (response.status === 200) {
        toast.success(`Bid ${action}ed successfully`);
        
        if (action === 'accept' && freelancerId) {
          navigate('/client/send-contract', {
            state: {
              bidId: bidId,
              taskId: id,
              freelancerId: freelancerId,
            }
          });
        }
        
        await fetchBids();
      }
    } catch (error:any) {
      toast.error(`Failed to ${action} bid`);
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  const sendMessage = async(bidderId: string) => {
    await axiosConfig.post('/users/set-contacts', {
      senderId: userId,
      receiverId: bidderId,
      role
    });
    navigate(`/messages`);
  };

  if (loading) {
    return <Loader visible={loading} />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 pt-24 bg-gray-100 min-h-screen">
      {confirmAction && (
        <ConfirmMessage
          message={`Are you sure you want to ${confirmAction.action} this bid?`}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center text-blue-600 font-semibold mb-4">
          <FaUser className="mr-2"/>{freelancerProfiles.length} Bidders
        </div>

        <ul>
          {bids.map((bid, index) => {
            const freelancerProfile = freelancerProfiles[index];
            if (!freelancerProfile) return null;

            return (
              <li
                key={bid._id}
                className="flex items-center justify-between p-4 border-b last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={freelancerProfile.profileImage || "/default-avatar.jpg"}
                    alt={freelancerProfile.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                  />
                  <div>
                    <h2 className="font-semibold text-lg flex items-center space-x-2">
                      <span>{freelancerProfile.name}</span>
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                      <span>{freelancerProfile.tagline}</span>
                    </p>
                    {bid.status === 'accepted' && (
                      <>
                      {bid.contractStatus === 'rejected' && (
                        <p className="text-sm text-red-800 flex items-center space-x-2">
                          <span>Contract rejected by the freelancer</span>
                        </p>
                      )}
                      </>
                    )}

                    <div className="flex mt-3 space-x-2">
                      {bid.status === 'pending' && (
                        <>
                          <button
                            onClick={() => setConfirmAction({
                              bidId: bid._id,
                              action: 'accept',
                              freelancerId: freelancerProfile._id
                            })}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => setConfirmAction({
                              bidId: bid._id,
                              action: 'reject'
                            })}
                            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {bid.status !== 'pending' && (
                        <div className="flex items-center gap-2">
                        <span className={`px-4 py-2 rounded-md ${
                          bid.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        </span>

                        {bid.status === 'accepted' && (
                          <div className="flex items-center gap-2">
                            {bid.contractStatus === 'rejected' ? (
                              <>
                                <button
                                  onClick={() => navigate(`/client/my-contract/${bid._id}`)} 
                                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                                >
                                  Resend Contract
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => navigate(`/client/my-contract/${bid._id}`)} 
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                              >
                                View Contract
                              </button>
                            )}
                          </div>
                        )}
                        </div>
                      )}
                      <button
                        onClick={() => sendMessage(bid.bidderId)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-md flex justify-evenly w-1/5">
                  <div className="text-center">
                    <p className="text-lg font-medium">${bid.rate}</p>
                    <p className="text-sm text-gray-500">rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium">{bid.deliveryTime} {bid.timeUnit}</p>
                    <p className="text-sm text-gray-500">Delivery Time</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BiddersList;