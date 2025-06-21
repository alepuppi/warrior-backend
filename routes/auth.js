const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../db'); // ✅ Usamos pool del nuevo db.js

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    try {
        // Consultar usuario en la base de datos
        const [results] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        console.log('Resultados de la base de datos:', results);

        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const user = results[0];

        console.log('Hash en BD:', user.password);

        // Comparar la contraseña ingresada con el hash en la BD
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('¿Contraseña coincide?', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username },
            'Rafaella2002', // 🔐 Te recomiendo mover esto a una variable de entorno luego
            { expiresIn: '1h' }
        );

        res.json({ token });

    } catch (err) {
        console.error('Error en la consulta de login:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
