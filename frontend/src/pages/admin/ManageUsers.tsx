import React from "react";

const ManageUsers: React.FC = () => {
  const users = [
    {
      name: "Duran Clayton",
      email: "Duran@Example.Com",
      company: "Supertech Ltd",
      position: "CEO & Founder",
      date: "11 Jun 2020",
      status: "Active",
    },
    {
      name: "David Milar",
      email: "David@Example.Com",
      company: "Realestate Solution",
      position: "Lead Developer",
      date: "31 May 2021",
      status: "Deactive",
    },
    // Add more users
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Users Datatable</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white text-left text-sm">
            <th className="p-4">User</th>
            <th className="p-4">Email</th>
            <th className="p-4">Company</th>
            <th className="p-4">Position</th>
            <th className="p-4">Join Date</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={index}
              className="border-b text-sm hover:bg-gray-100 transition-colors"
            >
              <td className="p-4">{user.name}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{user.company}</td>
              <td className="p-4">{user.position}</td>
              <td className="p-4">{user.date}</td>
              <td
                className={`p-4 font-semibold ${
                  user.status === "Active"
                    ? "text-green-600"
                    : user.status === "Deactive"
                    ? "text-orange-600"
                    : "text-red-600"
                }`}
              >
                {user.status}
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
