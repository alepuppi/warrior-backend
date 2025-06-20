// db.js
const mysql = require('mysql2');
if (process.env.NODE_ENV !== "production") {
require('dotenv').config();
}

console.log("🔍 DB_USER desde db.js:", process.env.DB_USER);
console.log("🌐 DB_HOST:", process.env.DB_HOST);
console.log("🔌 DB_PORT:", process.env.DB_PORT);
console.log("🗄️ DB_NAME:", process.env.DB_NAME);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Función para registrar auditoría
const registrarAuditoria = async (userId, accion, fecha) => {
    try {
        await pool.query(
            'INSERT INTO logs_auditoria (user_id, accion, fecha) VALUES (?, ?, ?)',
            [userId, accion, fecha]
        );
    } catch (error) {
        console.error('❌ Error al registrar auditoría:', error);
    }
};

// ✅ Exporta el pool como un objeto normal y agrega la función aparte
pool.registrarAuditoria = registrarAuditoria;

module.exports = pool;

console.log('Conectando con usuario:', process.env.DB_USER);
