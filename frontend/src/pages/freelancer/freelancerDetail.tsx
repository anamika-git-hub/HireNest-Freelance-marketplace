import React from "react";

const FreelancerDetail: React.FC = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Page Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Link */}
        <div className="mb-4">
          <a href="#" className="text-blue-600 hover:underline text-sm font-medium">
            &larr; Back to freelancers
          </a>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col md:flex-row bg-white p-6 rounded-lg shadow-lg mb-8">
          {/* Left Section: Profile Image */}
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <img
              src="https://via.placeholder.com/150"
              alt="Lily Woods"
              className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover"
            />
          </div>

          {/* Middle Section: Name, Role, and Details */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-800">Lily Woods</h1>
            <p className="text-blue-600 font-medium mb-4">Senior Brand Designer</p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipiscing elit erat morbi scelerisque mauris.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-100 px-3 py-2 rounded-md text-sm flex items-center">
                ✉️ info@lilywoods.com
              </div>
              <div className="bg-gray-100 px-3 py-2 rounded-md text-sm flex items-center">
                💰 $160/hr
              </div>
              <div className="bg-gray-100 px-3 py-2 rounded-md text-sm flex items-center">
                🕒 8 years of experience
              </div>
              <div className="bg-gray-100 px-3 py-2 rounded-md text-sm flex items-center">
                📍 New York, NY
              </div>
            </div>
          </div>

          {/* Right Section: Contact Button */}
          <div className="flex items-center justify-center mt-6 md:mt-0">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Contact Lily Woods
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2 text-blue-600">ℹ️</span> About Lily Woods
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc venenatis ridiculus nisl cursus
            pulvinar at eget congue. Vivamus fringilla turpis ac rutrum feugiat. Curabitur eget felis euismod.
          </p>
        </div>

        {/* Skills Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {["UI/UX Design", "Product Design", "Web Design", "Brand Design", "Motion Graphics"].map(
              (skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Portfolio Item 1 */}
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://via.placeholder.com/400x200"
                alt="Portfolio Item 1"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">Sezane Stationary Brand Design</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit.
                </p>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  View more &rarr;
                </a>
              </div>
            </div>

            {/* Portfolio Item 2 */}
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://via.placeholder.com/400x200"
                alt="Portfolio Item 2"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">Haus Packaging Brand Design</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit.
                </p>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  View more &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetail;
