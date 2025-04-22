const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;

const uri = 'mongodb+srv://user2:<db_12341234>@cluster1.5tdamcf.mongodb.net/'; // Cambia si usas Mongo Atlas
const dbName = 'EduTrack360';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const users = db.collection('usuarios');

        const user = await users.findOne({ email, password });
        if (user) {
            // Redirigir según rol
            if (user.rol === 'Administrador') {
                return res.json({ redirect: '/dashboard/admin' });
            } else if (user.rol === 'Estudiante') {
                return res.json({ redirect: '/dashboard/estudiante' });
            } else if (user.rol === 'Docente') {
                return res.json({ redirect: '/dashboard/docente' });
            }
        } else {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    } finally {
        await client.close();
    }
});

// Simulación de dashboards (puedes reemplazar por HTML reales)
app.get('/dashboard/admin', (req, res) => res.send('Bienvenido Administrador'));
app.get('/dashboard/estudiante', (req, res) => res.send('Bienvenido Estudiante'));
app.get('/dashboard/docente', (req, res) => res.send('Bienvenido Docente'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
