const skipToContent = () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.innerText = 'Skip to Content';

  skipLink.addEventListener('click', (event) => {
    const target = document.querySelector('#main-content');
    if (target) {
      target.focus();
    }
  });

  document.body.prepend(skipLink);
};

export function getUserToken() {
  return localStorage.getItem('token');
};

export default skipToContent;
