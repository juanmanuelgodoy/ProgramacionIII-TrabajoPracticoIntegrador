const { Sequelize } = require('sequelize');

// Configuración de la conexión a MySQL
const sequelize = new Sequelize('prog3', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
