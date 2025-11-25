import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'notifications', timestamps: true })
export class NotificationDoc {
  @Prop({ required: true }) habitId: string;
  @Prop({ required: true, enum: ['reminder', 'milestone', 'summary'] })
  type: string;
  @Prop({ required: true }) message: string;
  @Prop() notifyDatetime?: Date;
  @Prop() notifyTime?: string;
  @Prop({ default: 'Asia/Ho_Chi_Minh' }) timezone: string;
  @Prop() repeatRuleId?: string;
  @Prop({ default: true }) active: boolean;
}

export type NotificationDocument = HydratedDocument<NotificationDoc>;
export const NotificationSchema = SchemaFactory.createForClass(NotificationDoc);
