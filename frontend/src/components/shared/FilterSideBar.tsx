import React , {useState,useEffect} from "react";
import axiosConfig from "../../service/axios";

interface Category {
  id: string;
  name: string;
}

interface FilterSidebarProps {
  onFilterChange: (filters: { category: string, skills: string[], priceRange: { min: number, max: number } }) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState<string>("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<string>("");
    const [priceRange, setPriceRange] = useState<{ min: number, max: number }>({ min: 1000, max: 50000 });
    
      useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await axiosConfig.get("/admin/categories"); 
            if (response.status === 200) {
            setCategories(response.data);
            }
          } catch (error) {
            console.error("Error fetching categories", error);
            alert("Failed to load categories.");
          }
        };
    
        fetchCategories();
      }, []);


      const handleAddSkill = () => {
        if (skillInput.trim() && !skills.includes(skillInput)) {
          setSkills((prevSkills) => [...prevSkills, skillInput]);
          setSkillInput("");
        }
      };
    
      const handleRemoveSkill = (skill: string) => {
        setSkills((prevSkills) => prevSkills.filter((s) => s !== skill));
      };

      const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
        onFilterChange({
          category: e.target.value,
          skills,
          priceRange
        });
      };
    
      const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSkillInput(e.target.value);
      };
    
      const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRange = { ...priceRange, [e.target.name]: parseInt(e.target.value) };
        setPriceRange(newRange);
        onFilterChange({
          category,
          skills,
          priceRange: newRange
        });
      };

  return (
    <aside className="bg-blue-50 p-6 mt-14 rounded-lg shadow-md w-full md:w-1/4">
      <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
      <div className="space-y-4">
        {/* Category Selection */}
        <label className="block mb-2 font-medium text-sm">Category</label>
        <select 
        className="w-full p-2 border rounded-md"
        value={category}
        onChange={handleCategoryChange}
        >
            <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Skills Input */}
        <label className="block mb-2 font-medium text-sm">Skills</label>
        <div className="flex space-x-2 mt-2">
        <input
          type="text"
          placeholder="Enter skills"
          className="w-full p-2 border rounded-md"
          value={skillInput}
          onChange={handleSkillInputChange}
        />
         <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleAddSkill}
          >
         Add
        </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-3 py-1 rounded bg-blue-100 text-blue-600 text-sm font-medium"
            >
               {skill}
             <button
                type="button"
                className="ml-2 text-blue-600 hover:text-blue-800"
                onClick={() => handleRemoveSkill(skill)}
             >
               ×
              </button>
            </span>
               ))}
          </div>
        {/* Fixed Price Range */}
        <label className="block mb-2 font-medium text-sm">Fixed Price Range</label>
        <input
          type="range"
          className="w-full"
          name="min"
          min="1000"
          max="50000"
          value={priceRange.min}
          onChange={handlePriceRangeChange}
        />
        <div className="flex justify-between text-sm mt-1">
        <span>${priceRange.min}</span>
        <span>${priceRange.max}</span>
        </div>

        {/* Hourly Rate Range */}
        <label className="block mb-2 font-medium text-sm">Hourly Rate Range</label>
        <input
          type="range"
          className="w-full"
          name="max"
          min="10"
          max="1000"
          value={priceRange.max}
          onChange={handlePriceRangeChange}
        />
        <div className="flex justify-between text-sm mt-1">
        <span>${priceRange.min}</span>
        <span>${priceRange.max}</span>
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
