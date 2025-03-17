
interface Notification {
    _id?: string;
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
    handleNotificationClick?:(notificationId?:string, index?: number) => void;
    className?: string;
  }

const NotificationContent: React.FC<NotificationItemProps> = ({ notification, role ,handleNotificationClick, index, className = "" }) => {
  const handleClick = () => {
    if (handleNotificationClick) {
      handleNotificationClick(notification._id,index);
    }
};
  const textClassName = `ml-3 text-gray-700 ${className}`;
    const messages = {
      request_submission: () => (
        <p onClick={handleClick} className={textClassName}>
          You have a new request from
          <a href="/freelancer/requests" className="text-blue-500 hover:underline">
            {' '}{notification.senderName}
          </a>
        </p>
      ),
      bid_placed: () => (
        <p onClick={handleClick} className={textClassName}>
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
      bid_accepted: () =>  (
            <p onClick={handleClick} className={textClassName}>
              Congratulations! Your bid for the project{' '}
              <a href={notification.projectUrl} className="text-blue-500 hover:underline">
                {notification.projectName}
              </a>{' '}
              has been accepted by the client.
            </p>
          ),
      request_accepted:() => (
            <p onClick={handleClick} className={textClassName}>
              Congratulations! Your request for the freelancer{' '}
              <a href={notification.profileUrl} className="text-blue-500 hover:Underline">
                {notification.freelancerName}
              </a>{' '}
              has been accepted.
            </p>
          ),
      bid_rejected: () =>(
            <p onClick={handleClick} className={textClassName}>
              We regret to inform you that the client has rejected your bid for{' '}
              <a href={notification.projectUrl} className="text-blue-500 hover:underline">
                {notification.projectName}
              </a>{' '}
              .
            </p>
          ),
      request_rejected: () =>(
            <p onClick={handleClick} className={textClassName}>
              We regret to inform you that the freelancer{' '}
              <a href={notification.profileUrl} className="text-blue-500 hover:underline">
                {notification.freelancerName}
              </a>{' '}
               has rejected your request.
              .
            </p>
          ),
      contract_accepted:() => (
            <p onClick={handleClick} className={textClassName}>
              Congratulations! Your contract for the project{' '}
              <a href={notification.projectUrl} className="text-blue-500 hover:Underline">
                {notification.projectName}
              </a>{' '}
              has been accepted by the freelancer.
            </p>
          ),
      contract_rejected: () =>(
            <p onClick={handleClick} className={textClassName}>
              We regret to inform you that the freelancer has rejected your contract for{' '}
              <a href={notification.projectUrl} className="text-blue-500 hover:underline">
                {notification.projectName}
              </a>{' '}
              .
            </p>
          ),
          milestone_activated: () => (
            <p onClick={handleClick} className={textClassName}>
              A milestone for project{' '}
              <a href={notification.projectUrl} className="text-blue-500 hover:underline">
                {notification.projectName}
              </a>{' '}
              is now active. You can begin work, and payment will be released upon completion.
            </p>
          ),
          milestone_submission:() => (
            <p onClick={handleClick} className={textClassName}>
              A freelancer has submitted a milestone of the project{' '}
              <a href={notification.projectUrl} className="text-blue-500 hover:underline">
                {notification.projectName}
              </a>{' '}
              for a review.
            </p>
          ),
          milestone_accepted: () =>  (
            <p onClick={handleClick} className={textClassName}>
              Congratulations! Your milestone submission for the project{' '}
              <a href={notification.projectUrl} className="text-blue-500 hover:underline">
                {notification.projectName}
              </a>{' '}
              has been accepted by the client.
            </p>
          ),
          milestone_rejected: () =>(
            <p onClick={handleClick} className={textClassName}>
              We regret to inform you that the client has rejected your milestone submission for the project{' '}
              <a href={notification.projectUrl} className="text-blue-500 hover:underline">
                {notification.projectName}
              </a>{' '}
              .
            </p>
          ),
    };
  
    const MessageComponent = messages[notification.types as keyof typeof messages];
    return MessageComponent ? MessageComponent() : null;
  };

  export default NotificationContent