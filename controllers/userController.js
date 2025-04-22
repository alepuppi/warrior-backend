const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const userController = {
    login: (req, res) => {
        const { username, password } = req.body;

        // Buscamos el usuario en la base de datos
        User.getUserByUsername(username, (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }
            if (!user) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }

            // Comparamos la contraseña con la almacenada en la BD
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return res.status(500).json({ message: 'Error en el servidor' });
                if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

                res.json({ message: 'Inicio de sesión exitoso' });
            });
        });
    }
};

module.exports = userController;
