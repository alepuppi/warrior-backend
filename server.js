if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  
console.log("▶️ ENV USER:", process.env.DB_USER); // Agrega esto
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // Conectar la base de datos

const app = express(); // ⚠️ ¡Mueve esta línea aquí arriba!

const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(express.json()); // Permitir recibir JSON en las peticiones

// Importar rutas
const membresiasRouter = require('./routes/membresias');
const asistenciasRoutes = require('./routes/asistencias');
const renovacionesRoutes = require('./routes/renovaciones');
const userRoutes = require('./routes/users');
const clientesRoutes = require('./routes/clientes');
const authRoutes = require('./routes/auth'); // Para login

// Usar rutas
app.use("/api", asistenciasRoutes);
app.use("/api", renovacionesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api', authRoutes);
app.use('/api/membresias', membresiasRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor de warrior funcionando correctamente');
});

// Eliminar tokens expirados
const eliminarTokensExpirados = () => {
    const ahora = new Date();
    db.query('DELETE FROM tokens WHERE created_at < DATE_SUB(?, INTERVAL 7 DAY)', [ahora], (err, result) => {
        if (err) console.error('Error al eliminar tokens expirados:', err);
        else console.log(`Tokens expirados eliminados: ${result.affectedRows}`);
    });
};
setInterval(eliminarTokensExpirados, 60 * 60 * 1000);

// Endpoint asistencia (si prefieres tenerlo aquí en vez de en el archivo de rutas)
app.post('/asistencias/registrar', async (req, res) => {
    const { dni } = req.body;
    if (!dni) return res.status(400).json({ error: "DNI es requerido" });

    try {
        const [clienteResult] = await db.query("SELECT * FROM clientes WHERE dni = ?", [dni]);
        if (clienteResult.length === 0) return res.status(404).json({ error: "Cliente no encontrado" });

        const cliente = clienteResult[0];
        const hoy = new Date();
        const fecha = hoy.toISOString().slice(0, 10);
        const hora = hoy.toTimeString().slice(0, 8);

        await db.query("INSERT INTO asistencias (dni, fecha, hora) VALUES (?, ?, ?)", [dni, fecha, hora]);

        res.json({
            nombre: cliente.nombre_completo,
            dni: cliente.dni,
            fecha_matricula: cliente.fecha_matricula,
            fecha_vencimiento: cliente.fecha_vencimiento,
            vencido: new Date(cliente.fecha_vencimiento) < hoy
        });
    } catch (error) {
        console.error("Error al registrar asistencia:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

// Middleware de errores
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


