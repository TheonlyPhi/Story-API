import './styles/styles.css';
import router from './scripts/routes/routes.js';
import './scripts/utils/fixLeafletIcons.js';

// SPA Routing
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

// View Transition API
if ('startViewTransition' in document) {
  const navigateWithTransition = () => {
    document.startViewTransition(() => router());
  };

  window.removeEventListener('hashchange', router);
  window.addEventListener('hashchange', navigateWithTransition);
}

// Pendaftaran Service Worker untuk PWA & Push Notification
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        console.log('✅ Service Worker berhasil didaftarkan');
      })
      .catch((err) => {
        console.error('❌ Gagal mendaftarkan Service Worker:', err);
      });
  });
}

// Jika kamu tetap menggunakan class App, ini bisa dipertahankan
class App {
  constructor({ appRoot }) {
    this.appRoot = appRoot;
    window.addEventListener('hashchange', this.renderPage.bind(this));
    window.addEventListener('load', this.renderPage.bind(this));
  }

  async renderPage() {
    const urlHash = window.location.hash.slice(1).toLowerCase() || '/';
    const route = routes[urlHash] || routes['/'];

    this.appRoot.innerHTML = '';
    const pageElement = new route.page();
    this.appRoot.appendChild(pageElement);

    this.presenter = new route.presenter({ view: pageElement });

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        this.appRoot.innerHTML = '';
        this.appRoot.appendChild(pageElement);
      });
    }
  }
}

export default App;
