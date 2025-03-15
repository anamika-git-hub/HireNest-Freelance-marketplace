import React from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import BookmarksList from "../../components/shared/bookmarkList";

interface Freelancer {
    _id: string;
    profileImage: string;
    name: string;
    tagline: string;
}

const FreelancerBookmarks: React.FC = () => {
    const renderFreelancer = (freelancer: Freelancer, handleRemove: (id: string) => void) => (
        <li key={freelancer._id} className="flex justify-between items-center border-b last:border-b-0 py-4">
            <div className="w-3/4">
                <Link to={`/client/freelancer-detail/${freelancer._id}`}>
                    <div className="flex items-center space-x-2">
                        <img
                            src={freelancer.profileImage || "/default-avatar.jpg"}
                            alt={freelancer.name}
                            className="w-12 h-12 rounded-full border-2 border-gray-300"
                        />
                        <div>
                            <h2 className="text-lg font-medium">{freelancer.name}</h2>
                            <div className="flex items-center text-gray-500 text-sm">
                                {freelancer.tagline}
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handleRemove(freelancer._id)}
                    className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300"
                >
                    <FaTrash className="mr-1" /> Remove
                </button>
            </div>
        </li>
    );

    return (
        <BookmarksList<Freelancer>
            type="freelancer"
            title="Bookmarked Freelancers"
            fetchUrl="/client/freelancer-list"
            detailUrlPrefix="/client/freelancer-detail"
            renderItem={renderFreelancer}
            emptyMessage="No bookmarked freelancers found"
            searchPlaceholder="Search bookmarked freelancers..."
        />
    );
};

export default FreelancerBookmarks;