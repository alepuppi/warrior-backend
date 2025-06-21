const express = require('express');
const router = express.Router();
const { pool, registrarAuditoria } = require('../db'); // ✅ Importamos ambos

// Middleware para mostrar cada solicitud
router.use((req, res, next) => {
    console.log(`📥 Solicitud recibida en ${req.method} ${req.originalUrl}`);
    next();
});

// ✅ Obtener todos los clientes
router.get('/listado', async (req, res) => {
    try {
        const [clientes] = await pool.query('SELECT * FROM clientes');
        res.json(clientes);
    } catch (error) {
        console.error('❌ Error al obtener clientes:', error);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
});

// 📌 Registrar nuevo cliente
router.post('/registrar', async (req, res) => {
    console.log("📌 Petición POST en /registrar", req.body);
    const { nombre_completo, dni, celular, correo } = req.body;

    if (!nombre_completo || !dni || !celular || !correo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const sql = "INSERT INTO clientes (nombre_completo, dni, celular, correo, fecha_registro) VALUES (?, ?, ?, ?, NOW())";
        const valores = [nombre_completo, dni, celular, correo];
        const [result] = await pool.query(sql, valores);

        await registrarAuditoria('warrior', 'Registro', 'Nuevo cliente registrado');

        res.json({ message: 'Cliente registrado exitosamente', id: result.insertId });
    } catch (error) {
        console.error("❌ Error al registrar cliente:", error);
        res.status(500).json({ error: 'Error al registrar cliente', detalles: error.message });
    }
});

// 📌 Editar cliente
router.put('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, dni, celular, correo } = req.body;

    if (!nombre || !dni || !celular || !correo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const sql = "UPDATE clientes SET nombre_completo = ?, dni = ?, celular = ?, correo = ? WHERE id = ?";
        const valores = [nombre, dni, celular, correo, id];
        const [result] = await pool.query(sql, valores);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente no encontrado' });

        await registrarAuditoria('warrior', 'Edición', `Cliente con ID ${id} editado`);

        res.json({ message: 'Cliente actualizado correctamente' });
    } catch (error) {
        console.error("❌ Error al actualizar cliente:", error);
        res.status(500).json({ error: 'Error al actualizar cliente', detalles: error.message });
    }
});

// 📌 Eliminar cliente
router.delete('/eliminar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query("DELETE FROM clientes WHERE id = ?", [id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente no encontrado' });

        await registrarAuditoria('warrior', 'Eliminación', `Cliente con ID ${id} eliminado`);

        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error("❌ Error al eliminar cliente:", error);
        res.status(500).json({ error: 'Error al eliminar cliente', detalles: error.message });
    }
});

// 📌 Registrar membresía mensual
router.post('/membresias/mensual', async (req, res) => {
    const { nombre_completo, dni, fecha_inicio, metodo_pago, numero_boleta } = req.body;

    if (!nombre_completo || !dni || !fecha_inicio || !metodo_pago || !numero_boleta) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios para la membresía mensual' });
    }

    try {
        const sql = `INSERT INTO membresias_mensuales (nombre_completo, dni, fecha_inicio, metodo_pago, numero_boleta) VALUES (?, ?, ?, ?, ?)`;
        const valores = [nombre_completo, dni, fecha_inicio, metodo_pago, numero_boleta];
        const [result] = await pool.query(sql, valores);

        await registrarAuditoria('warrior', 'Registro', `Nueva membresía mensual registrada para ${dni}`);

        res.json({ message: 'Membresía mensual registrada correctamente', id: result.insertId });
    } catch (error) {
        console.error("❌ Error al registrar membresía mensual:", error);
        res.status(500).json({ error: 'Error al registrar membresía mensual', detalles: error.message });
    }
});

// 📌 Buscar nombre por DNI
router.get('/buscar/:dni', async (req, res) => {
    const { dni } = req.params;

    try {
        const sql = "SELECT nombre_completo FROM clientes WHERE dni = ?";
        const [resultado] = await pool.query(sql, [dni]);

        if (resultado.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });

        res.json({ nombre_completo: resultado[0].nombre_completo });
    } catch (error) {
        console.error("❌ Error al buscar cliente por DNI:", error);
        res.status(500).json({ error: 'Error al buscar cliente', detalles: error.message });
    }
});

module.exports = router;
