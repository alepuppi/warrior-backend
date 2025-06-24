if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("▶️ ENV USER:", process.env.DB_USER);
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { pool, registrarAuditoria } = require('./db');

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors({
  origin: [
    "https://warrior-frontend.vercel.app", // Producción
    "http://localhost:5173"                // Desarrollo local
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(bodyParser.json());
app.use(express.json());

// Importar rutas
const membresiasRouter = require('./routes/membresias');
const asistenciasRoutes = require('./routes/asistencias');
const renovacionesRoutes = require('./routes/renovaciones');
const userRoutes = require('./routes/users');
const clientesRoutes = require('./routes/clientes');
const authRoutes = require('./routes/auth');

// Usar rutas
app.use('/api/membresias', membresiasRouter);
app.use('/', asistenciasRoutes); // Aquí ya se define /asistencias/registrar
app.use('/api', renovacionesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor de warrior funcionando correctamente');
});

// Limpieza de tokens expirados
const eliminarTokensExpirados = async () => {
  try {
    const ahora = new Date();
    const [result] = await pool.query(
      'DELETE FROM tokens WHERE created_at < DATE_SUB(?, INTERVAL 7 DAY)',
      [ahora]
    );
    console.log(`Tokens expirados eliminados: ${result.affectedRows}`);
  } catch (err) {
    console.error('Error al eliminar tokens expirados:', err);
  }
};
setInterval(eliminarTokensExpirados, 60 * 60 * 1000);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
