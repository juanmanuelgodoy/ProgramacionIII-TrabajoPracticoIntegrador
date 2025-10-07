const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Servicio = sequelize.define('Servicio', {
    servicio_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    importe: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    creado: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    modificado: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'servicios',
    timestamps: false
});

module.exports = Servicio;
