import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';

@Injectable()
export class SchedulePolicyService {
  /**
   * expandSlots
   * Sinh danh sách ngày/giờ dựa theo rule và notifyTime
   */
  expandSlots(
    rule: any,
    notifyTime: string,
    timezone: string,
    horizonDays: number,
  ): Date[] {
    const result: Date[] = [];

    // ✅ Dùng moment-timezone đúng cách
    const now = moment().tz(timezone);
    const end = now.clone().add(horizonDays, 'days');

    // ✅ Phân tích giờ/phút từ chuỗi notifyTime
    const [hourStr, minuteStr] = notifyTime.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // ✅ Lặp theo loại rule
    if (rule.repeatType === 'daily') {
      for (let d = 0; d < horizonDays; d++) {
        const date = now
          .clone()
          .add(d, 'days')
          .hour(hour)
          .minute(minute)
          .second(0);
        result.push(date.toDate());
      }
    } else if (rule.repeatType === 'weekly') {
      const days = JSON.parse(rule.repeatValue).days || [];
      const dayMap: Record<string, number> = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
      };
      const validDays = days.map((d: string) => dayMap[d]);
      for (let d = 0; d < horizonDays; d++) {
        const date = now.clone().add(d, 'days');
        if (validDays.includes(date.day())) {
          date.hour(hour).minute(minute).second(0);
          result.push(date.toDate());
        }
      }
    }

    // có thể thêm monthly/custom sau
    return result;
  }

  /** slotKey: YYYYMMDD-HHmm */
  makeSlotKey(timestamp: number): string {
    return moment(timestamp).tz('Asia/Ho_Chi_Minh').format('YYYYMMDD-HHmm');
  }
}
