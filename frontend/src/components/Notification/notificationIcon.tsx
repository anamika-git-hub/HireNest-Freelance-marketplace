import { 
  MdWork, 
  MdGavel, 
  MdCheckCircle, 
  MdCancel, 
  MdPayment, 
  MdStar,
  MdAssignment,
  MdChat,
  MdPeople,
  MdNotifications
} from "react-icons/md";
import { 
  FaHandshake, 
  FaUserCheck, 
  FaUserTimes,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaCheckCircle,
  FaFileUpload,
  FaCheckDouble,
  FaTimesCircle
} from "react-icons/fa";

interface NotificationIconProps {
  type: string;
  className?: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ type, className = "" }) => {
  const getIconForType = () => {
    const defaultClasses = `text-xl ${className}`;
    
    const icons: Record<string, JSX.Element> = {
      // Project related
      request_submission: <MdWork className={`${defaultClasses} text-blue-500`} />,
      bid_placed: <MdGavel className={`${defaultClasses} text-blue-500`} />,
      project_created: <FaProjectDiagram className={`${defaultClasses} text-blue-500`} />,
      project_updated: <MdAssignment className={`${defaultClasses} text-blue-500`} />,
      project_completed: <MdCheckCircle className={`${defaultClasses} text-blue-500`} />,
      
      // Proposal/Bid related
      request_accepted: <FaHandshake className={`${defaultClasses} text-blue-500`} />,
      request_rejected: <MdCancel className={`${defaultClasses} text-red-500`} />,
      proposal_received: <MdWork className={`${defaultClasses} text-blue-500`} />,
      bid_accepted: <FaHandshake className={`${defaultClasses} text-blue-500`} />,
      bid_rejected: <MdCancel className={`${defaultClasses} text-red-500`} />,
      contract_accepted: <FaHandshake className={`${defaultClasses} text-blue-500`} />,
      contract_rejected: <MdCancel className={`${defaultClasses} text-red-500`} />,
      milestone_activated: <FaCheckCircle className={`${defaultClasses} text-green-500`} />,
      milestone_submission: <FaFileUpload className={`${defaultClasses} text-blue-500`} />,
      milestone_accepted: <FaCheckDouble className={`${defaultClasses} text-green-500`} />,
      milestone_rejected: <FaTimesCircle className={`${defaultClasses} text-red-500`} />,
      
      // Payment related
      payment_received: <MdPayment className={`${defaultClasses} text-blue-500`} />,
      payment_sent: <FaMoneyBillWave className={`${defaultClasses} text-blue-500`} />,
      payment_pending: <MdPayment className={`${defaultClasses} text-yellow-500`} />,
      milestone_completed: <MdStar className={`${defaultClasses} text-yellow-500`} />,
      
      // User related
      user_joined: <FaUserCheck className={`${defaultClasses} text-blue-500`} />,
      user_left: <FaUserTimes className={`${defaultClasses} text-red-500`} />,
      team_update: <MdPeople className={`${defaultClasses} text-blue-500`} />,
      
      // Communication
      message_received: <MdChat className={`${defaultClasses} text-blue-500`} />,
      
      // Default
      default: <MdNotifications className={`${defaultClasses} text-gray-500`} />
    };

    return icons[type] || icons.default;
  };

  return getIconForType();
};

export default NotificationIcon;