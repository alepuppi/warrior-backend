// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool, registrarAuditoria } = require('../db'); // usamos pool y función auditoría

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  try {
    const [results] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      'Rafaella2002', // ✅ luego puedes usar process.env.JWT_SECRET
      { expiresIn: '1h' }
    );

    // ✅ Registrar evento de login exitoso
    await registrarAuditoria(user.username, 'Inicio de sesión');

    res.json({ token });
  } catch (err) {
    console.error('Error en la consulta de login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
