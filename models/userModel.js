const db = require('../db'); // Importamos la conexión a la base de datos

const User = {
    getUserByUsername: (username, callback) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result[0]); // Retornamos el primer usuario encontrado
            }
        });
    }
};

module.exports = User;
