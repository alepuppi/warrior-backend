// src/socket.js
import { io } from "socket.io-client";

// Usamos tu backend desplegado en Render
const socket = io("https://thewarriorhouse.onrender.com", {
  transports: ["websocket"], // para forzar websocket y evitar polling
});

export default socket;
