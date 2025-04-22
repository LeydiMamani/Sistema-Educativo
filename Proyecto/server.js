const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;

const uri = 'mongodb+srv://user2:<db_12341234>@cluster1.5tdamcf.mongodb.net/'; // Cambia si usas Mongo Atlas
const dbName = 'EduTrack360';

app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/inmobiliaria', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.log('❌ Error en MongoDB:', err));

// Rutas API
app.use('/api', authRoutes);

// Simulación de dashboards (puedes reemplazar por HTML reales)
app.get('/dashboard/admin', (req, res) => res.send('Bienvenido Administrador'));
app.get('/dashboard/estudiante', (req, res) => res.send('Bienvenido Estudiante'));
app.get('/dashboard/docente', (req, res) => res.send('Bienvenido Docente'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
