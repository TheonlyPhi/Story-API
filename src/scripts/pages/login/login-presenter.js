import Api from '../../data/api.js';
import pushNotif from '../../utils/push-notif.js';

const LoginPresenter = {
  async login({ email, password }) {
    try {
      const response = await Api.login({ email, password });
      if (response.error) throw new Error(response.message);

      // Minta izin notifikasi dan langganan push notif
      if ('Notification' in window && Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }

      await pushNotif(); // langganan ke endpoint push API

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default LoginPresenter;
