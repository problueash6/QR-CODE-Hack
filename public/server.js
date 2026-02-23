const express = require('express');
const multer  = require('multer');
const path    = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// Fichiers statiques (public/)
app.use(express.static('public'));
app.use(express.json());

// Multer : stockage dans public/uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `face-${Date.now()}.jpg`);
  }
});
const upload = multer({ storage });

// Route POST /upload
app.post('/upload', upload.single('photo'), (req, res) => {
  const fileUrl = `${process.env.PUBLIC_URL || 'http://localhost:' + PORT}/uploads/${req.file.filename}`;
  console.log('📸 Photo reçue :', req.file.filename);
  res.json({ url: fileUrl });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});