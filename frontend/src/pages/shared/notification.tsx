import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import axiosConfig from "../../service/axios";
import Loader from "../../components/shared/Loader";
import NotificationItem from "../../components/shared/notificationItem";

interface Notification {
  role: string;
  text: string;
  profileUrl: string;
  projectUrl: string;
  types: string;
  senderName: string;
  projectName: string;
  freelancerName: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!userId) {
          throw new Error('User not logged in');
        }

        const { data } = await axiosConfig.get('/users/notifications');
        const filteredNotifications = data.filter(
          (notif: Notification) => notif.role === role
        );
        setNotifications(filteredNotifications);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, role]);

  if (loading) return <Loader visible={loading} />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

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
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <NotificationItem 
                key={index} 
                notification={notification} 
                role={role} 
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-2">No notifications</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;