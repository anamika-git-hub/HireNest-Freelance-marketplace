import React from 'react';

const Home: React.FC = () => {
    return (
        <>
        
            <div className="bg-cover bg-center h-screen flex flex-col justify-center text-center px-6"
                style={{
                    backgroundImage: "url('https://img.freepik.com/free-photo/team-coworkers-comparing-source-codes-running-laptop-screen-computer-monitor-it-development-office-software-developers-collaborating-data-coding-group-project-while-sitting-desk_482257-41846.jpg?t=st=1732350387~exp=1732353987~hmac=010e9fb6cd61dded2e322b967e756c848e0e6655f446d7b02c6be14fa9f36790&w=1060')",
                }}
                >
                {/* Headline Section */}
                <div className="text-white mb-8">
                    <h1 className="text-5xl font-bold">
                        Hire experts freelancers for any job, any time.
                    </h1>
                    <p className="text-lg mt-4">
                        Huge community of designers, developers, and creatives ready for your project.
                    </p>
                </div>

                {/* <div className="bg-transparent shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto flex items-center justify-center space-x-4 py-4">
        
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                        Post Task
                    </button>

                    <button className="border-2 border-blue-600  text-white px-6 py-3 rounded-lg hover:bg-blue-100">
                        Find Talent
                    </button>
                </div> */}

                {/* Stats Section */}
                <div className="flex justify-center mt-8 text-white space-x-12">
                    <div>
                        <h2 className="text-3xl font-bold">1,586</h2>
                        <p>Tasks Done</p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">3,543</h2>
                        <p>Tasks Posted</p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">1,232</h2>
                        <p>Freelancers</p>
                    </div>
                </div>
            </div>
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