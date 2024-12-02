import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUsersByType } from "../../store/userSlice";
import axiosConfig from "../../service/axios";

const ManageUsers: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [users, setUsers] = useState<any[]>([]);
  const dispatch = useDispatch();

  const userType = type === "freelancer" || type === "client" ? type : "client"; 

  const fetchUsers = async () => {
    try {
      const endpoint = userType === "freelancer" ? "admin/freelancers" : "admin/clients";
      const response = await axiosConfig.get(endpoint);

      const usersData = userType === "freelancer" ? response.data.freelancers : response.data.clients;
      setUsers(usersData);
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

  const toggleBlockUser = async (userId: string, isBlocked: boolean) => {
    const action = isBlocked ? "unblock" : "block"; 
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );
    
    if (confirmed) {
      console.log('userId:',userId, 'isblocked:', typeof(isBlocked))
      try {
        const response = await axiosConfig.put(`/admin/${userId}/${isBlocked}`);
        
        fetchUsers(); 
      } catch (error) {
        console.error(`Error during ${action} action:`, error);
      }
    }
}

  useEffect(() => {
    fetchUsers();
  }, [userType]); 

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">
        {userType === "freelancer" ? "Freelancer" : "Clients"} Data Table
      </h1>
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
          {users.map((user: any, index) => (
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
    </div>
  );
};

export default ManageUsers;
