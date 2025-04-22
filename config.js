require('dotenv').config();
module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'Rafaella2002',
    jwtExpiresIn: '1h'
};
