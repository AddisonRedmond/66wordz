import { Notification } from "@prisma/client";

type NotificationBadgeProps = {
    notification: Notification
}

const NotificationBadge: React.FC<NotificationBadgeProps> = (props) => {
  return <div>
    <p>{JSON.stringify(props.notification.content)}</p>
  </div>;
};
export default NotificationBadge;
