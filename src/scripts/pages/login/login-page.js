import LoginPresenter from './login-presenter.js';

const LoginPage = {
  async render() {
    return `
      <section>
        <h2>Login</h2>
        <form id="loginForm" aria-label="Form login">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />
          
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required minlength="8" />

          <button type="submit">Login</button>
          <p id="message" role="alert"></p>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('loginForm');
    const message = document.getElementById('message');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = form.email.value.trim();
      const password = form.password.value;

      try {
        const response = await LoginPresenter.login({ email, password });
        localStorage.setItem('token', response.loginResult.token);
        localStorage.setItem('userName', response.loginResult.name);
        message.textContent = 'Login berhasil!';
        message.style.color = 'green';
        window.location.hash = '#/story';
      } catch (error) {
        message.textContent = `Login gagal: ${error.message}`;
        message.style.color = 'red';
      }
    });
  }
};

export default LoginPage;
