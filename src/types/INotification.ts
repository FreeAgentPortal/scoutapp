import IUser from "./IUser";

export interface INotification {
  _id: string;
  notificationType: string;
  message: string;
  userTo: IUser;
  userFrom: IUser;
  entityId: string;
  opened: boolean;
  createdAt: string;
  description: string;
}
