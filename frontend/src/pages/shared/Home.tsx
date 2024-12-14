import React from 'react';
import HeroSection from '../../components/shared/hero';

const Home: React.FC = () => {
    return (
        <>
           <HeroSection/>
            <div className="py-16 bg-gray-100">
                <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
                    {/* Category Card 1 */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <img
                            src="https://via.placeholder.com/300x200"
                            alt="Web / Software Dev"
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4 text-center">
                            <h3 className="text-lg font-semibold">Web / Software Dev</h3>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">612</span>
                        </div>
                    </div>

                    {/* Category Card 2 */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <img
                            src="https://via.placeholder.com/300x200"
                            alt="Data Science / Analytics"
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4 text-center">
                            <h3 className="text-lg font-semibold">Data Science / Analytics</h3>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">113</span>
                        </div>
                    </div>

                    {/* Category Card 3 */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <img
                            src="https://via.placeholder.com/300x200"
                            alt="Accounting / Consulting"
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4 text-center">
                            <h3 className="text-lg font-semibold">Accounting / Consulting</h3>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">186</span>
                        </div>
                    </div>

                    {/* Category Card 4 */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <img
                            src="https://via.placeholder.com/300x200"
                            alt="Writing & Translations"
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4 text-center">
                            <h3 className="text-lg font-semibold">Writing & Translations</h3>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">298</span>
                        </div>
                    </div>

                    {/* More Cards... */}
                </div>
            </div>
            <div className="py-16 bg-white">
                <h2 className="text-3xl font-bold text-center mb-12">How It Works?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
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