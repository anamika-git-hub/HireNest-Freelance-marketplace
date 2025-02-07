import { Underline } from "lucide-react";

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
  }

const NotificationContent: React.FC<NotificationItemProps> = ({ notification, role }) => {
    const messages = {
      request: () => (
        <p className="ml-3 text-sm text-gray-700">
          You have a new request from
          <a href="/freelancer/requests" className="text-blue-500 hover:underline">
            {' '}{notification.senderName}
          </a>
        </p>
      ),
      bid: () => (
        <p className="ml-3 text-sm text-gray-700">
          <a href={notification.profileUrl} className="text-blue-500 hover:underline">
            {notification.senderName}
          </a>{' '}
          placed a bid on your{' '}
          <a href={notification.projectUrl} className="text-blue-500 hover:underline">
            {notification.projectName}
          </a>{' '}
          project.
        </p>
      ),
      accepted: () => {
        if (role === 'freelancer') {
          return (
            <p className="ml-3 text-sm text-gray-700">
              Congratulations! Your bid for the project{' '}
              <a href={notification.projectUrl} className="text-blue-500 hover:underline">
                {notification.projectName}
              </a>{' '}
              has been accepted by the client.
            </p>
          );
        }else if(role === 'client') {
          return (
            <p className="ml-3 text-sm text-gray-700">
              Congratulations! Your request for the freelancer{' '}
              <a href={notification.profileUrl} className="text-blue-500 hover:Underline">
                {notification.freelancerName}
              </a>{' '}
              has been accepted.
            </p>
          )
        }
        return null;
      },
      rejected: () => {
        if (role === 'freelancer') {
          return (
            <p className="ml-3 text-sm text-gray-700">
              We regret to inform you that the client has rejected your bid for{' '}
              <a href={notification.projectUrl} className="text-blue-500 hover:underline">
                {notification.projectName}
              </a>{' '}
              .
            </p>
          );
        } else if (role === 'client') {
          return (
            <p className="ml-3 text-sm text-gray-700">
              We regret to inform you that the freelancer{' '}
              <a href={notification.profileUrl} className="text-blue-500 hover:underline">
                {notification.freelancerName}
              </a>{' '}
               has rejected your request.
              .
            </p>
          );
        }
        return null;
      }
    };
  
    const MessageComponent = messages[notification.types as keyof typeof messages];
    return MessageComponent ? MessageComponent() : null;
  };

  export default NotificationContent