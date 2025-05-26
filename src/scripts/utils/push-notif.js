const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const pushNotif = async () => {
  try {
    if (!('serviceWorker' in navigator)) return;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('🔕 Notifikasi tidak diizinkan oleh pengguna.');
      return;
    }

    const reg = await navigator.serviceWorker.ready;

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'
      )
    });

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('❌ Token login tidak ditemukan.');
      return;
    }

    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    console.log('✅ Berhasil berlangganan notifikasi:', result);
  } catch (error) {
    console.error('❌ Gagal mengaktifkan push notif:', error);
  }
};

export default pushNotif;
