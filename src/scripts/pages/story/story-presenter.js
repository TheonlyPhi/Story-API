import Api from '../../data/api.js';
import Idb from '../../utils/idb.js';

const StoryPresenter = {
  async getStories(token) {
    try {
      const response = await Api.getStories(token, true); // true = pakai location=1
      const stories = response.listStory;

      // Simpan semua story ke IndexedDB
      await Idb.clearAllStories();
      await Idb.putStories(stories);

      return stories;
    } catch (error) {
      // Fallback ke data offline jika API gagal
      const offlineStories = await Idb.getAllStories();
      if (offlineStories.length > 0) {
        return offlineStories;
      }
      throw new Error('Gagal mengambil data dari API dan tidak ada data lokal tersedia');
    }
  },
};

export default StoryPresenter;
