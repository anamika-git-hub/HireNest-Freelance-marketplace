import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCategory: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!name.trim() || !description.trim()) {
      setError("Both fields are required.");
      return;
    }

    console.log("New Category:", { name, description });

    navigate("/admin/categories");
  };

  return (
    <div className="p-6 bg-gray-100 ">
      <h1 className="text-2xl font-semibold mb-6">Create New Category</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md max-w-6xl mx-auto"
      >
        {error && (
          <div className="text-orange-600 mb-4 text-sm font-medium">{error}</div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category description"
            rows={4}
          ></textarea>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Add Category
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/manage-categories")}
            className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
