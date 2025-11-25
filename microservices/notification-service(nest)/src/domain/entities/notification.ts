export type NotificationType = 'reminder' | 'milestone' | 'summary';

export class Notification {
  constructor(
    readonly _id: string, // _id sẽ là ObjectId dạng string
    readonly habitId: string,
    readonly type: NotificationType,
    readonly message: string,
    readonly timezone: string = 'Asia/Ho_Chi_Minh',
    readonly notifyDatetime?: Date, // one-time
    readonly notifyTime?: string, // HH:mm nếu là recurring
    readonly repeatRuleId?: string, // UUID từ Habit Service
    readonly active: boolean = true,
  ) {}

  // domain logic đơn giản (nếu cần)
  isOneTime(): boolean {
    return !!this.notifyDatetime && !this.repeatRuleId;
  }

  isRecurring(): boolean {
    return !!this.repeatRuleId || !!this.notifyTime;
  }
}
