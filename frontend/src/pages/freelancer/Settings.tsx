import React from "react";
import MyAccount from "../shared/MyAccount";
import MyProfile from "./MyProfile";

const SettingsPage: React.FC = () => {
  return (
    <div className="p-10 max-w-5xl mx-auto bg-white rounded-lg shadow space-y-12">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      {/* My Account Section */}
      <div>
        <MyAccount />
      </div>

      {/* My Profile Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">My Profile</h3>
        <MyProfile />
      </div>

      <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
        Save Changes
      </button>
    </div>
  );
};

export default SettingsPage;
