import React from "react";

const TaskList = () => {
  const jobs = [
    {
      title: "Food Delivery Web App",
      time: "2 minutes ago",
      price: "$1,000 - $2,500",
      type: "Fixed Price",
    },
    {
      title: "2000 Words English to German",
      time: "5 minutes ago",
      price: "$75",
      type: "Fixed Price",
    },
    {
      title: "WordPress Theme Installation",
      time: "30 minutes ago",
      price: "$100",
      type: "Fixed Price",
    },
    {
      title: "PHP Core Website Fixes",
      time: "1 hour ago",
      price: "$50 - $80",
      type: "Hourly Rate",
    },
    {
      title: "Design a Landing Page",
      time: "2 hours ago",
      price: "$500",
      type: "Fixed Price",
    },
    {
      title: "Website and Logo Redesign",
      time: "3 hours ago",
      price: "$850 - $1,000",
      type: "Fixed Price",
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-5">
        <h2 className="text-xl font-semibold mb-5">Filters</h2>
        <div className="mb-5">
          <label className="block mb-2 font-medium">Location</label>
          <input
            type="text"
            placeholder="Location"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Category</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            <option>All Categories</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Keywords</label>
          <div className="flex">
            <input
              type="text"
              placeholder="e.g. task title"
              className="w-full p-2 border border-gray-300 rounded-l"
            />
            <button className="bg-blue-500 text-white px-4 rounded-r">+</button>
          </div>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Fixed Price</label>
          <input type="range" className="w-full" />
          <p className="text-gray-600">$50 - $2,500</p>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Hourly Rate</label>
          <input type="range" className="w-full" />
          <p className="text-gray-600">$10 - $150</p>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded">
              Front-end Dev
            </span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded">
              React
            </span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded">
              Design
            </span>
          </div>
          <input
            type="text"
            placeholder="Add more skills"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Search
        </button>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-5">
        {/* Search Alerts */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>Turn on email alerts for this search</span>
            </label>
          </div>
          <select className="p-2 border border-gray-300 rounded">
            <option>Relevance</option>
          </select>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-2 gap-5">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="border border-gray-300 p-5 rounded shadow-sm"
            >
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-gray-600 text-sm">{job.time}</p>
              <p className="font-semibold mt-3">{job.price}</p>
              <p className="text-gray-600">{job.type}</p>
              <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded">
                Bid Now
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2 mt-5">
          <button className="px-4 py-2 border border-gray-300 rounded">
            &lt;
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
