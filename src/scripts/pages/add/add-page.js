import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AddStoryPresenter from './add-story-presenter.js';
import '../../utils/fixLeafletIcons.js';

const AddPage = {
  async render() {
    return `
      <section>
        <h2>Tambah Cerita Baru</h2>
        <form id="addStoryForm" aria-label="Form tambah cerita">
          <label for="description">Deskripsi</label>
          <textarea id="description" name="description" required></textarea>

          <label>Foto (gunakan kamera)</label>
          <video id="video" autoplay playsinline style="width: 100%; max-height: 200px;"></video>
          <button type="button" id="captureBtn">Ambil Foto</button>
          <canvas id="canvas" style="display:none;"></canvas>
          <img id="photoPreview" alt="Preview foto" style="max-width: 100%; margin-top: 10px; display:none;" />

          <label>Pilih Lokasi Cerita</label>
          <div id="map" style="height: 300px;"></div>
          <p>Latitude: <span id="latValue">-</span></p>
          <p>Longitude: <span id="lonValue">-</span></p>

          <button type="submit">Kirim Cerita</button>
          <p id="message" role="alert"></p>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const photoPreview = document.getElementById('photoPreview');
    const latValue = document.getElementById('latValue');
    const lonValue = document.getElementById('lonValue');
    const message = document.getElementById('message');
    const form = document.getElementById('addStoryForm');

    let stream = null;

    // Fungsi untuk mematikan kamera
    function stopCamera() {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (error) {
      message.textContent = 'Tidak dapat mengakses kamera.';
      message.style.color = 'red';
    }

    // Matikan kamera saat user pindah halaman atau reload
    window.addEventListener('hashchange', stopCamera);
    window.addEventListener('beforeunload', stopCamera);

    captureBtn.addEventListener('click', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      photoPreview.src = dataUrl;
      photoPreview.style.display = 'block';

      stopCamera(); // matikan kamera setelah ambil gambar
    });

    const mapContainer = L.DomUtil.get('map');
    if (mapContainer && mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    const map = L.map('map').setView([-6.2, 106.8], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let marker = null;
    let selectedLat = null;
    let selectedLon = null;

    map.on('click', (e) => {
      selectedLat = e.latlng.lat;
      selectedLon = e.latlng.lng;

      latValue.textContent = selectedLat.toFixed(6);
      lonValue.textContent = selectedLon.toFixed(6);

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.textContent = '';

      const description = form.description.value.trim();
      if (!description || !photoPreview.src || !selectedLat || !selectedLon) {
        message.textContent = 'Semua data harus diisi lengkap.';
        message.style.color = 'red';
        return;
      }

      const blob = dataURLtoBlob(photoPreview.src);
      const token = localStorage.getItem('token');
      if (!token) {
        message.textContent = 'Harus login terlebih dahulu.';
        return;
      }

      try {
        await AddStoryPresenter.addStory({
          description,
          photo: blob,
          lat: selectedLat,
          lon: selectedLon,
          token
        });
        message.textContent = 'Cerita berhasil dikirim!';
        message.style.color = 'green';
        form.reset();
        photoPreview.style.display = 'none';
        latValue.textContent = '-';
        lonValue.textContent = '-';
        if (marker) map.removeLayer(marker);
        stopCamera(); // matikan kamera setelah submit
      } catch (error) {
        message.textContent = `Gagal kirim cerita: ${error.message}`;
        message.style.color = 'red';
      }
    });

    function dataURLtoBlob(dataurl) {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
  }
};

export default AddPage;
