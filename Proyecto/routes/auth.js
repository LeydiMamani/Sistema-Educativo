const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ message: 'Correo ya registrado' });

    const nuevoUsuario = new Usuario({ nombre, correo, password, rol });
    await nuevoUsuario.save();

    res.status(200).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Verificar si el usuario existe y la contraseña es correcta
    const usuario = await Usuario.findOne({ correo });
    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Si las credenciales son correctas, enviamos la respuesta con los datos del usuario
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      rol: usuario.rol,
      nombre: usuario.nombre,
      correo: usuario.correo, // <- Se agrega el correo del usuario
      id: usuario._id // <- Se agrega el _id del usuario
    });

  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


module.exports = router;

