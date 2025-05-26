import Api from '../../data/api.js';

const AddStoryPresenter = {
  async addStory({ description, photo, lat, lon, token }) {
    try {
      const response = await Api.addStory({ description, photo, lat, lon, token });

      if (response.error) throw new Error(response.message);

      // Tampilkan push notifikasi lokal setelah sukses submit
      if ('Notification' in window && Notification.permission === 'granted') {
        const swReg = await navigator.serviceWorker.ready;
        swReg.showNotification('Story berhasil dibuat', {
          body: `Deskripsi: ${description}`,
          icon: '/icons/icon-192.png',
          tag: 'story-created'
        });
      }

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default AddStoryPresenter;
