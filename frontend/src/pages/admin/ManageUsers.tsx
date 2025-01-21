import React, { useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUsersByType } from "../../store/userSlice";
import axiosConfig from "../../service/axios";

interface User {
  name?:string;
  createdAt: string;
  email: string;
  isBlocked: boolean;
  isVerified: boolean;
  _id: string;
}

const ManageUsers: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 6
  const inputRef = useRef<HTMLInputElement | null>(null);
   useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 600);
  
      return () => {
        clearTimeout(handler);
      };
    }, [searchTerm]);

  const dispatch = useDispatch();

  const userType = type === "freelancer" || type === "client" ? type : "client"; 

  const fetchUsers = async () => {
    try {
      const endpoint = userType === "freelancer" ? "admin/freelancers" : "admin/clients";
      const response = await axiosConfig.get(endpoint,{
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          searchTerm: debouncedSearchTerm,
        }
      });

      const usersData = userType === "freelancer" ? response.data.freelancers : response.data.clients;
      setUsers(usersData);
      setTotalPages(response.data.totalPages);
      dispatch(
        setUsersByType({
          userType: userType as "freelancer" | "client", 
          users: usersData,
        })
      );
    } catch (error) {
      console.error(`Error fetching ${userType}:`, error);
    }
  };

  useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [debouncedSearchTerm]);

  const toggleBlockUser = async (userId: string, isBlocked: boolean) => {
    const action = isBlocked ? "unblock" : "block"; 
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );
    
    if (confirmed) {
      try {
        await axiosConfig.put(`/admin/${userId}/${isBlocked}`);
        
        fetchUsers(); 
      } catch (error) {
        console.error(`Error during ${action} action:`, error);
      }
    }
}

const handlePageChange = (page: number) => {
  setCurrentPage(page);
};

  useEffect(() => {
    fetchUsers();
  }, [userType,debouncedSearchTerm,currentPage]); 

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">
        {userType === "freelancer" ? "Freelancer" : "Clients"} Data Table
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white text-left text-sm">
            <th className="p-4">User</th>
            <th className="p-4">Email</th>
            <th className="p-4">Join Date</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User, index) => (
            <tr
              key={index}
              className="border-b text-sm hover:bg-gray-100 transition-colors"
            >
              <td className="p-4">{user.name || "N/A"}</td>
              <td className="p-4">{user.email || "N/A"}</td>
              <td className="p-4">
                {new Date(user.createdAt).toLocaleDateString() || "N/A"}
              </td>
              <td
                className={`p-4 font-semibold ${
                  user.isBlocked
                    ? "text-red-600"
                    : user.isVerified
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {user.isBlocked
                  ? "Blocked"
                  : user.isVerified
                  ? "Verified"
                  : "Pending"}
              </td>
              <td className="p-4">
                <button
                  className={`${
                    user.isBlocked ? "text-green-500" : "text-red-500"
                  } hover:underline ml-4`}
                  onClick={() => toggleBlockUser(user._id, user.isBlocked)}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                page === currentPage
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
    </div>
  );
};

export default ManageUsers;
