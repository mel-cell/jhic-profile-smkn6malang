import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class UserSettingService {
  // Get user settings
  static async getUserSettings(userId: string) {
    const settings = await prisma.userSetting.findMany({
      where: { userId },
    });

    // Convert to key-value object
    const settingsObj: { [key: string]: string } = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    return settingsObj;
  }

  // Get specific setting
  static async getUserSetting(userId: string, key: string) {
    const setting = await prisma.userSetting.findFirst({
      where: { userId, key },
    });
    return setting?.value || null;
  }

  // Set user setting
  static async setUserSetting(userId: string, key: string, value: string) {
    // First try to find existing setting
    const existing = await prisma.userSetting.findFirst({
      where: { userId, key },
    });

    if (existing) {
      return await prisma.userSetting.update({
        where: { id: existing.id },
        data: { value },
      });
    } else {
      return await prisma.userSetting.create({
        data: { userId, key, value },
      });
    }
  }

  // Set multiple settings
  static async setUserSettings(userId: string, settings: { [key: string]: string }) {
    const results = [];
    for (const [key, value] of Object.entries(settings)) {
      const result = await this.setUserSetting(userId, key, value);
      results.push(result);
    }
    return results;
  }

  // Delete user setting
  static async deleteUserSetting(userId: string, key: string) {
    return await prisma.userSetting.deleteMany({
      where: { userId, key },
    });
  }

  // Get default settings
  static getDefaultSettings() {
    return {
      email_notifications: 'true',
      push_notifications: 'true',
      message_notifications: 'true',
      application_updates: 'true',
      job_alerts: 'true',
      profile_visibility: 'public',
      language: 'id',
      timezone: 'Asia/Jakarta',
    };
  }

  // Initialize default settings for new user
  static async initializeUserSettings(userId: string) {
    const defaultSettings = this.getDefaultSettings();
    return await this.setUserSettings(userId, defaultSettings);
  }
}
