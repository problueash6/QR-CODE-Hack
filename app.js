// ⚠️ Remplace cette URL par ton URL ngrok quand tu lanceras ngrok
const UPLOAD_URL = 'https:\eli-arty-herma.ngrok-free.dev';

// Démarrage de la caméra
window.onload = function () {
  startCamera();
};

function startCamera() {
  const video = document.getElementById('preview');
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
    .then(stream => {
      video.srcObject = stream;
      video.play();
    })
    .catch(err => {
      document.getElementById('status').textContent = '❌ Caméra inaccessible : ' + err.message;
    });
}

function captureAndUpload() {
  const video  = document.getElementById('preview');
  const canvas = document.getElementById('frame-canvas');
  const ctx    = canvas.getContext('2d');
  const status = document.getElementById('status');

  // 1. Capture la frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  status.textContent = '📤 Upload en cours...';

  // 2. Convertit en blob et upload
  canvas.toBlob(blob => {
    const form = new FormData();
    form.append('photo', blob, 'face.jpg');

    fetch(UPLOAD_URL, { method: 'POST', body: form })
      .then(r => r.json())
      .then(data => {
        status.textContent = '✅ Photo uploadée !';
        console.log('URL reçue :', data.url);
        generateQR(data.url);
      })
      .catch(err => {
        status.textContent = '❌ Erreur upload : ' + err.message;
      });
  }, 'image/jpeg');
}

function generateQR(url) {
  const container = document.getElementById('qr-code');
  container.innerHTML = ''; // reset
  new QRCode(container, {
    text: url,
    width: 200,
    height: 200
  });
}