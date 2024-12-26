import React,{useState,useEffect} from "react";
import { FaUser,FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axiosConfig from "../../service/axios";

interface Bid {
 rate:string;
 deliveryTime:number;
 timeUnit:string;
 bidderId:string;
}
interface BidderProfile {
    name: string;
    profileImage: string | null;
    tagline:string;
}


const BiddersList: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [freelancerProfiles, setFreelancerProfiles] = useState<BidderProfile[]>([]);

    useEffect(() => {
        const fetchBids = async () => {
          try {
            const response = await axiosConfig.get(`/freelancers/task-bids/${id}`);
            const fetchedBidders = response.data.bids; 
            const fetchedProfiles = await Promise.all(
                fetchedBidders.map(async (bidder: Bid) => {
                  const freelancerProfileResponse = await axiosConfig.get(
                    `/freelancers/freelancer-profile/${bidder.bidderId}`
                  );
                  return freelancerProfileResponse.data; // Assuming the response contains profile details
                })
              );
      
              // Update the profiles state
              setFreelancerProfiles(fetchedProfiles);
              setBids(fetchedBidders)
            setLoading(false);
          } catch (err) {
            setError("Failed to load bidders. Please try again later.");
            setLoading(false);
          }
        };
    
        if (id) {
          fetchBids();
        }
      }, [id]);
    
      if (loading) {
        return <div>Loading bidders...</div>;
      }
    
      if (error) {
        return <div className="text-red-500">{error}</div>;
      }

  return (
    <div className="p-6 pt-24 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center text-blue-600 font-semibold mb-4">
            <FaUser className="mr-2"/>{freelancerProfiles.length} Bidders
      </div>

      <ul>
          {bids.map((bid, index) => {
            const freelancerProfile = freelancerProfiles[index];
            if (!freelancerProfile) return null; // Skip if no profile is available for this bid

            return (
              <li
                key={index}
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
                    <div className="flex mt-3 space-x-2">
                      <button className="px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Accept Offer
                      </button>
                      <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
                        Send Message
                      </button>
                      <button className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">
                        <FaTrash className="mr-1" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-md flex justify-evenly w-1/5">
                {/* Bids */}
                <div className="text-center">
                  <p className="text-lg font-medium">${bid.rate}</p>
                  <p className="text-sm text-gray-500">rate</p>
                </div>
                {/* Price Range */}
                <div className="text-center">
                  <p className="text-lg font-medium">{bid.deliveryTime} {bid.timeUnit}</p>
                  <p className="text-sm text-gray-500">Delivery Time </p>
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
