
import React , { useState } from "react";
import { useNavigate } from "react-router-dom";

const ManageCategories: React.FC = () => {
    const navigate = useNavigate();
  const categories = [
    {
      name: "Web development",
      description: "Lorem ipsum dolor sit amet lorem non consectetur adipiscing elit amet.Devices and gadgets",
      date: "15 Jul 2021",
      status: "Active",
    },
    {
      name: "Designining",
      description: "Lorem ipsum dolor sit amet lorem non consectetur adipiscing elit amet.",
      date: "23 Oct 2020",
      status: "Inactive",
    },
    {
      name: "Marketing",
      description: "Lorem ipsum dolor sit amet lorem non consectetur adipiscing elit amet.",
      date: "05 Mar 2022",
      status: "Active",
    },
  ];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="p-6 bg-gray-100 ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Category Management</h1>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          onClick={() => navigate("/admin/create-category")}
        >
          Create New
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white text-left text-sm">
            <th className="p-4">Category Name</th>
            <th className="p-4">Description</th>
            <th className="p-4">Created Date</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category, index) => (
            <tr
              key={index}
              className="border-b text-sm hover:bg-gray-100 transition-colors"
            >
              <td className="p-4">{category.name}</td>
              <td className="p-4">{category.description}</td>
              <td className="p-4">{category.date}</td>
              <td
                className={`p-4 font-semibold ${
                  category.status === "Active" ? "text-green-600" : "text-orange-600"
                }`}
              >
                {category.status}
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

      {/* Show message if no categories match the search */}
      {filteredCategories.length === 0 && (
        <div className="text-center text-gray-600 mt-4">No categories found.</div>
      )}
    </div>
  );
};

export default ManageCategories;
