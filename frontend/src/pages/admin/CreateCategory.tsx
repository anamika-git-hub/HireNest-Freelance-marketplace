import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../../service/axios";

const CreateCategory: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, description };

    try {
      const response = await axiosConfig.post("/admin/categories", payload)
      if (response.status === 201) {
        setTimeout(() => {
          navigate("/admin/categories"); 
        }, 1500);
      }
    } catch (err) {
      console.error("Error creating category", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Create New Category</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Create Category
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
