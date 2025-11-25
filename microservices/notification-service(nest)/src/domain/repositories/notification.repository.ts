import { Notification } from '../entities/notification';

export interface NotificationRepository {
  create(notification: Notification): Promise<Notification>;
  updateActive(_id: string, active: boolean): Promise<void>;
  findById(_id: string): Promise<Notification | null>;
  findAllActive(): Promise<Notification[]>;
}

export const NOTIFICATION_REPO = Symbol('NotificationRepository');
