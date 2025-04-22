const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const path = require('path');
const cors = require('cors');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/EduTrack360', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.log('❌ Error en MongoDB:', err));

// Rutas API
app.use('/api', authRoutes);

// Rutas estáticas (HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
