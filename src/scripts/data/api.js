const BASE_URL = 'https://story-api.dicoding.dev/v1';

const Api = {
  async register({ name, email, password }) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  async login({ email, password }) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async getStories(token, location = false) {
    const url = `${BASE_URL}/stories?location=${location ? 1 : 0}`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(url, { headers });
    const data = await res.json();
    if (data.error) throw new Error(data.message);
    return data;
  },

  async addStory({ description, photo, lat, lon, token }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat !== undefined && lon !== undefined) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const url = token ? `${BASE_URL}/stories` : `${BASE_URL}/stories/guest`;
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.message);
    return data;
  },
};

export default Api;
