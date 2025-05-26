import Api from '../../data/api.js';
import pushNotif from '../../utils/push-notif.js';

const RegisterPresenter = {
  async register({ name, email, password }) {
    try {
      const response = await Api.register({ name, email, password });
      if (response.error) throw new Error(response.message);

      // Minta izin notifikasi dan langganan push notif
      if ('Notification' in window && Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }

      await pushNotif();

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default RegisterPresenter;
