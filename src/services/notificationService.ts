/**
 * Web Push and Browser Notification Service
 */
export class NotificationService {
  /**
   * Request browser notification permission
   */
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  /**
   * Send a local notification for pickup alerts
   */
  static sendPickupAlert(title: string, body: string, icon = '/favicon.svg') {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon,
      });
    }
  }
}
