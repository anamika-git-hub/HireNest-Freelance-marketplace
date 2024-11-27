import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getClients } from "../../store/userSlice";
import axiosConfig from "../../service/axios";

const ManageUsers: React.FC = () => {
  const [clients, setClients] = useState([]); // State to store the clients
  const dispatch = useDispatch();

  const fetchClients = async () => {
    try {
      const response = await axiosConfig.get("admin/clients");
      console.log("Response:", response.data);

      // Assuming the response has a structure { clients: [...] }
      const clientsData = response.data.clients || [];
      setClients(clientsData); // Set the extracted array to state
      dispatch(getClients(clientsData));
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients(); // Fetch clients on component mount
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Users Datatable</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white text-left text-sm">
            <th className="p-4">User</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Join Date</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client: any, index) => (
            <tr
              key={index}
              className="border-b text-sm hover:bg-gray-100 transition-colors"
            >
              <td className="p-4">{client.name || "N/A"}</td>
              <td className="p-4">{client.email || "N/A"}</td>
              <td className="p-4">{client.role || "N/A"}</td>
              <td className="p-4">
                {new Date(client.createdAt).toLocaleDateString() || "N/A"}
              </td>
              <td
                className={`p-4 font-semibold ${
                  client.isBlocked
                    ? "text-red-600"
                    : client.isVerified
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {client.isBlocked
                  ? "Blocked"
                  : client.isVerified
                  ? "Verified"
                  : "Pending"}
              </td>
              <td className="p-4">
                <button className="text-blue-500 hover:underline">Edit</button>
                <button className="text-red-500 hover:underline ml-4">
                  Delete
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
