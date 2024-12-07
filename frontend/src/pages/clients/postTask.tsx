import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TaskSubmissionForm: React.FC = () => {
    return (
      <div className="min-h-screen  flex items-center justify-center p-6 "
      style={{
        backgroundImage: "url()",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
       >
        <div className="p-8 bg-white rounded-xl shadow-lg max-w-6xl w-full space-y-9 ">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Post a Task</h2>
          <div className="space-y-6">
            {/* Project Name and Category */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. build me a website"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Category
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Category</option>
                  <option value="web">Web Development</option>
                  <option value="design">Graphic Design</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Timeline/Deadline
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
  
            {/* Skills */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                What skills are required?
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add Skills"
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  +
                </button>
              </div>
            </div>
  
            {/* Budget */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Minimum
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="USD"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Maximum
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="USD"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-gray-700 text-sm font-medium">
                  Fixed Price Project
                </label>
                <input type="radio" name="projectType" />
                <label className="block text-gray-700 text-sm font-medium">
                  Hourly Project
                </label>
                <input type="radio" name="projectType" />
              </div>
            </div>
  
            {/* Description */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Describe Your Project
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
              ></textarea>
            </div>
  
            {/* File Upload */}
            <div className="border-t-2 border-gray-300 pt-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Upload Files
              </label>
              <button className="px-4 py-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 text-sm">
                Upload Files
              </button>
            </div>
  
            {/* Submit */}
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Post a Task
            </button>
          </div>
        </div>
      </div>
    );
  };
  

export default TaskSubmissionForm;
