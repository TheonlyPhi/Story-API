import StoryPresenter from './story-presenter.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../utils/fixLeafletIcons.js';

const StoryPage = {
  async render() {
    return `
      <section>
        <h2>Cerita Terbaru</h2>
        <div id="story-list" class="story-list"></div>
        <div id="map" style="height: 400px; margin-top: 20px;"></div>
      </section>
    `;
  },

  async afterRender() {
    const token = localStorage.getItem('token');
    const container = document.getElementById('story-list');

    if (!token) {
      window.location.hash = '/login';
      return;
    }

    try {
      const stories = await StoryPresenter.getStories(token);

      container.innerHTML = stories.map(story => `
        <div class="story-item">
          <img src="${story.photoUrl}" alt="Gambar cerita ${story.name}" width="150" />
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <small>Dibuat: ${new Date(story.createdAt).toLocaleString()}</small>
        </div>
      `).join('');

      // Hindari inisialisasi ulang Leaflet map
      const mapContainer = L.DomUtil.get('map');
      if (mapContainer && mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
      }

      const map = L.map('map').setView([-2.5489, 118.0149], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap contributors'
      }).addTo(map);

      stories.forEach(story => {
        if (story.lat && story.lon) {
          L.marker([story.lat, story.lon])
            .addTo(map)
            .bindPopup(`<b>${story.name}</b><br>${story.description}`);
        }
      });

    } catch (error) {
      container.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }
};

export default StoryPage;
