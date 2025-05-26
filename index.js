import App from './scripts/app.js';

const appRoot = document.getElementById('app'); // pastikan ada <div id="app"></div> di index.html

const app = new App({ appRoot });

App.init();
