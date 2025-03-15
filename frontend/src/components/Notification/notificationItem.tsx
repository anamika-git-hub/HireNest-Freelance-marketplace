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
}



const NotificationItem: React.FC<NotificationItemProps> = ({ notification, role, handleNotificationClick ,index}) => (
  <div className="p-3 flex items-start gap-3 border-b last:border-none hover:bg-gray-100 rounded-md">
    <div className="flex">
      <NotificationIcon type={notification.types} />
      <NotificationContent notification={notification} role={role} handleNotificationClick = {handleNotificationClick} index={index}/>
    </div>
  </div>
);

export default NotificationItem;