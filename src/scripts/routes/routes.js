import StoryPage from '../pages/story/story-page.js';
import AddPage from '../pages/add/add-page.js';
import LoginPage from '../pages/login/login-page.js';
import RegisterPage from '../pages/register/register-page.js';

const routes = {
  '/': StoryPage,
  '/story': StoryPage,
  '/add': AddPage,
  '/login': LoginPage,
  '/register': RegisterPage,
};

const router = async () => {
  const content = document.getElementById('main-content');
  const hash = window.location.hash.slice(1).toLowerCase() || '/';
  const page = routes[hash] || StoryPage;

  content.innerHTML = await page.render();
  if (typeof page.afterRender === 'function') {
    await page.afterRender();
  }
};

export default router;
