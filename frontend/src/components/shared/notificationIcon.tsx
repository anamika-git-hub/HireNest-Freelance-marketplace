
import { MdWork, MdGavel } from "react-icons/md";

const NotificationIcon: React.FC<{ type: string }> = ({ type }) => {
  const icons = {
    request: <MdWork className="text-gray-500 text-xl" />,
    bid: <MdGavel className="text-gray-500 text-xl" />,
    accepted: <MdGavel className="text-gray-500 text-xl" />,
    rejected: <MdGavel className="text-gray-500 text-xl" />
  };

  return icons[type as keyof typeof icons] || null;
};

export default NotificationIcon