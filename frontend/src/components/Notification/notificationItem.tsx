import NotificationIcon from "./notificationIcon";
import NotificationContent from "./notificationContent";

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

interface NotificationItemProps {
  notification: Notification;
  role: string | null;
  index?:number;
  handleNotificationClick?:(notificationId?:string,index?: number) => void;
  className?:string;
}



const NotificationItem: React.FC<NotificationItemProps> = ({ notification, role, handleNotificationClick ,index,className=""}) => (
  <div className="p-3 flex items-start gap-3 border-b last:border-none hover:bg-gray-100 rounded-md">
    <div className="flex">
      <NotificationIcon 
      type={notification.types}
      className={className === "dropdown-size"? "text-sm": ""} />
      <NotificationContent 
      notification={notification} 
      role={role} 
      handleNotificationClick = {handleNotificationClick} 
      index={index} 
      className={className === "dropdown-size" ? "text-xs" : ""}/>
    </div>
  </div>
);

export default NotificationItem;