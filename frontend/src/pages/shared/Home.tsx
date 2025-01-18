import React, { useEffect, useState } from 'react';
import axiosConfig from '../../service/axios'; 
import HeroSection from '../../components/shared/hero';

const Home: React.FC = () => {

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosConfig.get("/admin/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
           <HeroSection/>
           <div className="py-16 bg-gray-50">
               <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                   {/* Category Card */}
                   {categories.map((category, index) => (
                       <div key={index} className="relative group bg-white shadow-lg rounded-lg overflow-hidden">
                           <img
                               src={category.image}
                               alt={category.name}
                               className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                           />
                           <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                               <h3 className="text-white text-lg font-semibold mb-2">{category.name}</h3>
                               <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">100</span>
                           </div>
                       </div>
                   ))}
               </div>
           </div>

           <div className="py-16 bg-white">
               <h2 className="text-3xl font-bold text-center mb-12">How It Works?</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                   {/* Step 1 */}
                   <div className="text-center">
                       <div className="relative mx-auto w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4">
                           <span className="text-2xl font-bold">1</span>
                       </div>
                       <h3 className="text-lg font-bold mb-2">Create an Account</h3>
                       <p className="text-gray-600">
                           Bring to the table win-win survival strategies to ensure proactive domination going forward.
                       </p>
                   </div>

                   {/* Step 2 */}
                   <div className="text-center">
                       <div className="relative mx-auto w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4">
                           <span className="text-2xl font-bold">2</span>
                       </div>
                       <h3 className="text-lg font-bold mb-2">Post a Task</h3>
                       <p className="text-gray-600">
                           Efficiently unleash cross-media information without boundaries. Maximize ROI quickly.
                       </p>
                   </div>

                   {/* Step 3 */}
                   <div className="text-center">
                       <div className="relative mx-auto w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4">
                           <span className="text-2xl font-bold">3</span>
                       </div>
                       <h3 className="text-lg font-bold mb-2">Choose an Expert</h3>
                       <p className="text-gray-600">
                           Nanotechnology immersion along the information highway will close the loop on focusing solely.
                       </p>
                   </div>
               </div>
           </div>
        </> 
    );
};

export default Home;
