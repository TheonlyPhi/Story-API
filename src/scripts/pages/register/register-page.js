import RegisterPresenter from './register-presenter.js';

const RegisterPage = {
  async render() {
    return `
      <section>
        <h2>Register</h2>
        <form id="registerForm" aria-label="Form registrasi">
          <label for="name">Nama</label>
          <input type="text" id="name" name="name" required />

          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" required minlength="8" />

          <button type="submit">Daftar</button>
          <p id="message" role="alert"></p>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('registerForm');
    const message = document.getElementById('message');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;

      try {
        await RegisterPresenter.register({ name, email, password });
        message.textContent = 'Registrasi berhasil! Silakan login.';
        message.style.color = 'green';
        form.reset();
        window.location.hash = '#/login';
      } catch (error) {
        message.textContent = `Registrasi gagal: ${error.message}`;
        message.style.color = 'red';
      }
    });
  }
};

export default RegisterPage;
