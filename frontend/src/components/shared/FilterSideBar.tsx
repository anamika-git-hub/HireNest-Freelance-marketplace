import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const FilterSidebar: React.FC= () => {
      const categories = useSelector((state: RootState) => state.category.categories);
      console.log('ccccccccccc',categories)
  return (
    <aside className="bg-blue-50 p-6 mt-14 rounded-lg shadow-md w-full md:w-1/4">
      <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
      <div className="space-y-4">
        {/* Category Selection */}
        <label className="block mb-2 font-medium text-sm">Category</label>
        <select className="w-full p-2 border rounded-md">
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Skills Input */}
        <label className="block mb-2 font-medium text-sm">Skills</label>
        <input
          type="text"
          placeholder="Enter skills"
          className="w-full p-2 border rounded-md"
        />

        {/* Fixed Price Range */}
        <label className="block mb-2 font-medium text-sm">Fixed Price Range</label>
        <input type="range" className="w-full" />
        <div className="flex justify-between text-sm mt-1">
          <span>$10</span>
          <span>$5000</span>
        </div>

        {/* Hourly Rate Range */}
        <label className="block mb-2 font-medium text-sm">Hourly Rate Range</label>
        <input type="range" className="w-full" />
        <div className="flex justify-between text-sm mt-1">
          <span>$10</span>
          <span>$250</span>
        </div>

        {/* Search Button */}
        <button className="bg-blue-500 text-white w-full p-2 rounded-md">
          Search
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
