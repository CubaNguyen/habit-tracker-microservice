import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NotificationDoc,
  NotificationDocument,
} from './schemas/notification.schema';
import { Notification } from '../../domain/entities/notification';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(
    @InjectModel(NotificationDoc.name)
    private readonly model: Model<NotificationDocument>,
  ) {}

  private toDomain(doc: NotificationDocument): Notification {
    return new Notification(
      doc._id.toString(),
      doc.habitId,
      doc.type as any,
      doc.message,
      doc.timezone,
      doc.notifyDatetime,
      doc.notifyTime,
      doc.repeatRuleId,
      doc.active,
    );
  }

  async create(notification: Notification): Promise<Notification> {
    const created = await this.model.create({
      habitId: notification.habitId,
      type: notification.type,
      message: notification.message,
      notifyDatetime: notification.notifyDatetime,
      notifyTime: notification.notifyTime,
      timezone: notification.timezone,
      repeatRuleId: notification.repeatRuleId,
      active: notification.active,
    });
    return this.toDomain(created);
  }

  async updateActive(_id: string, active: boolean): Promise<void> {
    await this.model.updateOne({ _id }, { active });
  }

  async findById(_id: string): Promise<Notification | null> {
    const doc = await this.model.findById(_id);
    return doc ? this.toDomain(doc) : null;
  }

  async findAllActive(): Promise<Notification[]> {
    const docs = await this.model.find({ active: true }).exec();
    return docs.map(this.toDomain);
  }
}
