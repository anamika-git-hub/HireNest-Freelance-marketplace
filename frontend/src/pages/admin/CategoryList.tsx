import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store"; 
import { getCategories, deleteCategory } from "../../store/categorySlice";
import axiosConfig from "../../service/axios";
import { useNavigate } from "react-router-dom";

const ManageCategories: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.category.categories);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 4
  const inputRef = useRef<HTMLInputElement | null>(null);
     useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedSearchTerm(searchTerm);
        }, 600);
    
        return () => {
          clearTimeout(handler);
        };
      }, [searchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosConfig.get("/users/categories",{
          params: {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            searchTerm: debouncedSearchTerm,
          }
        });
        setTotalPages(response.data.totalPages);
        dispatch(getCategories(response.data.categories));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [dispatch,debouncedSearchTerm,currentPage]);


  useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [debouncedSearchTerm]);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

  const handleDeleteCategory = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (confirmed) {
      try {
        await axiosConfig.delete(`/admin/categories/${id}`);
        dispatch(deleteCategory(id));
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Category Management</h1>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          onClick={() => navigate("/admin/categories/new")}
        >
          Create New
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white text-left text-sm">
            <th className="p-4">Image</th>
            <th className="p-4">Category Name</th>
            <th className="p-4">Description</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr
              key={category.id || `${category.name}-${index}`}
              className="border-b text-sm hover:bg-gray-100 transition-colors"
            >
              <td className="p-4">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={`${category.name} thumbnail`}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-500 italic">No image</span>
                )}
              </td>
              <td className="p-4">{category.name}</td>
              <td className="p-4">{category.description}</td>
              
              <td className="p-4">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline ml-4"
                  onClick={() => handleDeleteCategory(category.id!)}
                >
                  Delete
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

      {categories.length === 0 && (
        <div className="text-center text-gray-600 mt-4">No categories found.</div>
      )}


    </div>
  );
};

export default ManageCategories;
