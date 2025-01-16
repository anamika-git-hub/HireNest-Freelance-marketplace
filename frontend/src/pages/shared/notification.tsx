import React, { useEffect, useState } from "react";
import { FaBell, FaClock, FaUsers, FaUserCircle } from "react-icons/fa";
import axiosConfig from "../../service/axios";
import Loader from "../../components/shared/Loader";
import { Link } from "react-router-dom";

interface Notification {
  text: string
}

const Notifications: React.FC = () => {
    const [notifications,setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    let type = ''
    if(role === 'client'){
        type = 'bid'
    }else {
        type = 'request'
    }
    const fetchNotifications = async() => {
        if(userId){
            const response = await axiosConfig.get(`/users/notifications/${type}`)
            console.log('response',response)
            setNotifications(response.data);
            setLoading(false)
        }else{
          setError('User not logged in');
          setLoading(false);
        }
    }
    useEffect(()=> {
        fetchNotifications()
    },[])

    if (loading) {
      return <Loader visible={loading} />;
    }
  
    if (error) {
      return <div>{error}</div>;
    }

 return(
    <div className="bg-white shadow-md rounded-lg p-4 pt-24">
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-800 text-lg font-bold">Notifications</h3>
                  <button className="text-gray-500 hover:text-gray-700">
                    <FaBell className="w-5 h-5" />
                  </button>
                </div>
                <ul className="mt-4 divide-y divide-gray-200">
                  {notifications.map((notification,index)=>(
                    <li
                    key={index}
                     className="flex items-start py-2">
                    <FaUserCircle className="w-6 h-6 text-gray-300" />
                    
                    <p className="ml-3 text-sm text-gray-700">
                      {notification.text}
                    </p>
                    </li>
                  ))}
                </ul>
              </div>
 )
}

export default Notifications