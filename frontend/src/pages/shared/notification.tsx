import React, { useEffect, useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { MdWork, MdGavel, MdSync } from "react-icons/md";
import axiosConfig from "../../service/axios";
import Loader from "../../components/shared/Loader";
import { Link } from "react-router-dom";

interface Notification {
  text: string;
  bidderProfileUrl: string;
  projectUrl: string;
  types: string;
  senderName: string;
  projectName: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

const fetchNotifications = async () => {
  if (userId) {
    const response = await axiosConfig.get(`/users/notifications`);
    console.log('ress', response.data);

    if (role === 'client') {
      const filteredNotifications = response.data.filter((notif: Notification) => notif.types === 'bid');
      setNotifications(filteredNotifications);
    } else if(role === 'freelancer') {
      const filteredNotifications = response.data.filter((notif: Notification) => notif.types === 'request');
      setNotifications(filteredNotifications); 
    }

    setLoading(false);
  } else {
    setError('User not logged in');
    setLoading(false);
  }
};


  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <Loader visible={loading} />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const notificationText = () => {
    return (
      <>
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <div key={index} className="p-3 flex items-start gap-3 border-b last:border-none hover:bg-gray-100 rounded-md">
              {/* Icon Based on Notification Type */}
              {notif.types === "request" && <div className="flex ">
                  <MdWork className="text-gray-500 text-xl" />
                    <p className="ml-3 text-sm text-gray-700">
                      You have a new request from 
                      <a href="/freelancer/requests"
                      className="text-blue-500 hover:underline"
                      > {' '}
                      {notif.senderName}</a>
                     
                    </p>
                </div>}
              {notif.types === "bid" &&
                <div className="flex ">
                  <MdGavel className="text-gray-500 text-xl" />
                    <p className="ml-3 text-sm text-gray-700">
                      <a
                        href={notif.bidderProfileUrl}
                        className="text-blue-500 hover:underline"
                      >
                        {notif.senderName}
                      </a>{' '}
                      placed a bid on your{' '}
                      <a
                        href={notif.projectUrl}
                        className="text-blue-500 hover:underline"
                      >
                        {notif.projectName}
                      </a>{' '}
                      project.
                    </p>
                </div>
              }
              {notif.types === "job_expiry" && <MdSync className="text-gray-500 text-2xl" />}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-2">No notifications</p>
        )}
      </>
    );
  };

  return (
    <div className="p-6 pt-24 bg-gray-100 min-h-screen select-none">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-800 text-lg font-bold">Notifications</h3>
          <button className="text-gray-500 hover:text-gray-700">
            <FaBell className="w-5 h-5" />
          </button>
        </div>
        <ul className="mt-4 divide-y divide-gray-200">
          {notificationText()}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
