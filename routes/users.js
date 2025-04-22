const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connection: db, registrarAuditoria } = require('../db'); // Importa correctamente
const router = express.Router();
const { jwtSecret, jwtExpiresIn } = require('../config');

let refreshTokens = []; // Almacenar temporalmente los Refresh Tokens

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('🔍 Intento de login:', username);

    if (!username || !password) {
        console.log('❌ Error: Faltan datos en la solicitud');
        return res.status(400).json({ message: 'Faltan datos' });
    }

    try {
        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) {
                console.error('❌ Error en la consulta SQL:', err);
                return res.status(500).json({ message: 'Error en la base de datos' });
            }

            if (results.length === 0) {
                console.log('⚠ Usuario no encontrado:', username);
                registrarAuditoria(null, 'FAILED_LOGIN', `Intento fallido para el usuario: ${username}`);
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }

            const user = results[0];
            console.log('✅ Usuario encontrado:', user.username);

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                console.log('❌ Contraseña incorrecta');
                registrarAuditoria(user.id, 'FAILED_LOGIN', 'Contraseña incorrecta');
                return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
            }

            console.log('🔑 Contraseña correcta, generando tokens...');
            
            const accessToken = jwt.sign(
                { userId: user.id, username: user.username },
                jwtSecret,
                { expiresIn: jwtExpiresIn }
            );

            const refreshToken = jwt.sign(
                { userId: user.id, username: user.username },
                jwtSecret,
                { expiresIn: '7d' }
            );

            db.query('INSERT INTO tokens (user_id, token) VALUES (?, ?)', [user.id, refreshToken], (err) => {
                if (err) {
                    console.error('❌ Error al guardar el token en la base de datos:', err);
                    return res.status(500).json({ message: 'Error al guardar el token en la base de datos' });
                }

                registrarAuditoria(user.id, 'LOGIN', 'Inicio de sesión exitoso');
                console.log('✅ Login exitoso');
                
                res.json({ message: 'Login exitoso', accessToken, refreshToken });
            });
        });
    } catch (error) {
        console.error('❌ Error en el servidor:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
