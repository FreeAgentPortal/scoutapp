import { INotification } from "@/types/INotification";


export default (notification: INotification) => {
  switch (notification.notificationType) {
    case 'support':
      return `/account_details/support/${notification.entityId}`;
    default:
      return '/';
  }
};
