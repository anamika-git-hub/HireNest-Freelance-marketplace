import React from "react";

const MyProfile: React.FC = () => {
  return (
    <section className="space-y-8 p-6 bg-white shadow-lg rounded-lg  ">
       <h3 className="text-lg font-semibold text-gray-800 mb-6">My Profile</h3>
      {/* Minimal Hourly Rate */}
      <div className="flex space-x-40 ">
        <div className="w-auto">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Set your minimal hourly rate
          </label>
          <div className="flex items-center space-y-6 space-x-4">
            <span className="text-gray-500 text-lg font-medium">$</span>
            <input
              type="number"
              className="w-20 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="35"
              defaultValue={35}
            />
          </div>
          <input
              type="range"
              className="flex-grow w-72"
              min="10"
              max="100"
              step="1"
              defaultValue={35}
            />
        </div>

        {/* Skills Section */}
        <div >
          <label className="block text-gray-700 text-sm font-medium mb-1">Skills</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {["Vue JS", "iOS", "Android", "Angular", "Laravel"].map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 rounded bg-blue-100 text-blue-600 text-sm font-medium"
              >
                {skill}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label={`Remove ${skill}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            className="mt-4 w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Angular, Laravel"
          />
        </div>
       
      </div>

      {/* Attachments */}
      <div className="border-t-2 border-grey-300 space-y-6 pt-4">
        <label className="block text-gray-700 text-sm space-x-3 font-medium mb-1">Attachments</label>
        <div className="flex items-center space-x-4">
          <div className="text-gray-700">Cover Letter</div>
          <button className="px-4 py-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium">
            Upload Files
          </button>
        </div>
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Tagline</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="iOS Expert + Node Dev"
          defaultValue="iOS Expert + Node Dev"
        />
      </div>

      {/* Nationality */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Nationality</label>
        <select
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          defaultValue="United States"
        >
          <option>United States</option>
          <option>Canada</option>
          <option>India</option>
          <option>Germany</option>
        </select>
      </div>

      {/* Introduction */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Introduce Yourself</label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Write about yourself..."
          rows={4}
          defaultValue="Leverage agile frameworks to provide a robust synopsis for high-level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment."
        ></textarea>
      </div>
    </section>
  );
};

export default MyProfile;
