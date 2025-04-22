const bcrypt = require('bcrypt');

const passwordIngresada = 'aterdonob1712';
const passwordEncriptada = '$2b$10$0aGgK4F9GJFXECzkAyoZf.7/QQaqVLEp1zWrWIaY1wwXuhoBr3/bC'; // Hash guardado en la BD

bcrypt.compare(passwordIngresada, passwordEncriptada, (err, result) => {
    if (err) {
        console.error('Error al comparar:', err);
    } else {
        console.log('¿La contraseña es correcta?', result);
    }
});
